import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil, startWith, map } from 'rxjs/operators';
import { PaginationConstants } from 'src/app/shared/constants/constants';
import { UserTabsUkr, UserTabsUkrReverse } from 'src/app/shared/enum/enumUA/tech-admin/users-tabs';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Child, ChildCards } from 'src/app/shared/models/child.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { UsersTable } from 'src/app/shared/models/usersTable';
import { GetChildrenForAdmin } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { PopNavPath, PushNavPath } from 'src/app/shared/store/navigation.actions';
import { OnPageChangeAdminTable, SetChildrensPerPage } from 'src/app/shared/store/paginator.actions';
import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { Util } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  readonly userRoleUkr = UserTabsUkr;
  readonly noUsers = NoResultsTitle.noUsers;

  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(AdminState.children)
  children$: Observable<ChildCards>;
  @Select(PaginatorState.childrensPerPage)
  childrensPerPage$: Observable<number>;

  filterFormControl = new FormControl('');
  filterValue: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex: number;
  allUsers: Parent[] | Child[] = [];
  parents: Parent[] = [];
  children: UsersTable[];
  totalEntities: number;
  displayedColumns: string[] = ['pib', 'email', 'phone', 'place', 'role', 'status'];
  currentPage: PaginationElement = PaginationConstants.firstPage;

  constructor(public store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.filterFormControl.valueChanges
      .pipe( 
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        startWith(''),
        debounceTime(2000),
        map((value: string)=> value.trim()))
      .subscribe((searchString:string)=> this.store.dispatch(new GetChildrenForAdmin(searchString)));

    this.children$
      .pipe(
        takeUntil(this.destroy$),
        filter((children: ChildCards) => !!children)
      )
      .subscribe((children: ChildCards) => {
        this.children = Util.updateStructureForTheTable(children.entities);
        this.totalEntities = children.totalAmount;
        this.allUsers = this.children;
      });

    this.store.dispatch([
      new GetChildrenForAdmin(),
      new PushNavPath(
        {
          name: NavBarName.Users,
          isActive: false,
          disable: true,
        },
      ),
    ]);


    // this.parents$.pipe(
    //   takeUntil(this.destroy$),
    //   filter((parents: Parent[]) => !!parents)
    // ).subscribe((parents: Parent[]) => this.parents = Util.updateStructureForTheTable(parents))
    // TODO: for the tab 'Батьки' will implement when backend will be ready

    // this.parents$.pipe(
    //   takeUntil(this.destroy$),
    //   filter((parents: Parent[]) => !!parents),
    //   combineLatestWith(this.children$),
    // ).subscribe(users => this.allUsers = Util.updateStructureForTheTable(users))
    // this.store.dispatch(new GetParents());
    // TODO: for the tab 'Усі' will implement when backend will be ready
  }

  /**
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    this.filterFormControl.reset();
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { role: UserTabsUkrReverse[event.tab.textLabel] },
    });
  }
  
  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeAdminTable(page), new GetChildrenForAdmin()]);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetChildrensPerPage(itemsPerPage), new GetChildrenForAdmin()]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}
