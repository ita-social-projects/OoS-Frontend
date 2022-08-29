import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil, startWith, map } from 'rxjs/operators';
import { PaginationConstants } from 'src/app/shared/constants/constants';
import { UserTabs, UserTabsUkr, UserTabsUkrReverse } from 'src/app/shared/enum/enumUA/tech-admin/users-tabs';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Child, ChildCards, ChildrenParameters } from 'src/app/shared/models/child.model';
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
  allUsers: UsersTable[] = [];
  totalEntities: number;
  displayedColumns: string[] = ['pib', 'email', 'phone', 'place', 'role', 'status'];
  currentPage: PaginationElement = PaginationConstants.firstPage;
  childrenParams: ChildrenParameters = {
    searchString: "",
    tabTitle: undefined,
  };

  constructor(public store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.filterFormControl.valueChanges
      .pipe( 
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        startWith(''),
        debounceTime(2000),)
        // map((value: string)=> value.trim()))
      .subscribe((searchString:string)=> {
        this.childrenParams.searchString = searchString;
        this.store.dispatch(new GetChildrenForAdmin(this.childrenParams))});

    this.children$
      .pipe(
        takeUntil(this.destroy$),
        filter((children: ChildCards) => !!children)
      )
      .subscribe((children: ChildCards) => {
        this.allUsers = Util.updateStructureForTheTable(children.entities);
        this.totalEntities = children.totalAmount;
      });
     
    this.store.dispatch([
      new GetChildrenForAdmin(this.childrenParams),
      new PushNavPath(
        {
          name: NavBarName.Users,
          isActive: false,
          disable: true,
        },
      ),
    ]);
  }

  /**
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    this.childrenParams.tabTitle = event.tab.textLabel;
    this.store.dispatch(new GetChildrenForAdmin(this.childrenParams));
    this.filterFormControl.reset();
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { role: UserTabsUkrReverse[event.tab.textLabel] },
    });
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeAdminTable(page), new GetChildrenForAdmin(this.childrenParams)]);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetChildrensPerPage(itemsPerPage), new GetChildrenForAdmin(this.childrenParams)]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}
