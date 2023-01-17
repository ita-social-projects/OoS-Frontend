import { EmailConfirmationStatuses, EmailConfirmationStatusesTitles } from './../../../../shared/enum/statuses';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil, startWith, skip } from 'rxjs/operators';
import { SearchResponse } from '../../../../shared/models/search.model';
import { PaginationConstants } from '../../../../shared/constants/constants';
import { UserTabsUkr, UserTabsUkrReverse } from '../../../../shared/enum/enumUA/tech-admin/users-tabs';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { Child, ChildrenParameters } from '../../../../shared/models/child.model';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { UsersTable } from '../../../../shared/models/usersTable';
import { GetChildrenForAdmin } from '../../../../shared/store/admin.actions';
import { AdminState } from '../../../../shared/store/admin.state';
import { PushNavPath, PopNavPath } from '../../../../shared/store/navigation.actions';
import { OnPageChangeAdminTable, SetTableItemsPerPage } from '../../../../shared/store/paginator.actions';
import { PaginatorState } from '../../../../shared/store/paginator.state';
import { Util } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  readonly userRoleUkr = UserTabsUkr;
  readonly noUsers = NoResultsTitle.noUsers;
  readonly statusesTitles = EmailConfirmationStatusesTitles;

  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(AdminState.children)
  children$: Observable<SearchResponse<Child[]>>;
  @Select(PaginatorState.tableItemsPerPage)
  tableItemsPerPage$: Observable<number>;

  filterFormControl = new FormControl('');
  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex: number;
  allUsers: UsersTable[] = [];
  totalEntities: number;
  displayedColumns: string[] = ['pib', 'email', 'phone', 'role', 'status'];
  currentPage: PaginationElement = PaginationConstants.firstPage;
  childrenParams: ChildrenParameters = {
    searchString: '',
    tabTitle: undefined
  };

  constructor(public store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.filterFormControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(2000), takeUntil(this.destroy$))
      .subscribe((searchString: string) => {
        this.childrenParams.searchString = searchString;
        this.store.dispatch(new GetChildrenForAdmin(this.childrenParams));
      });

    this.children$
      .pipe(
        takeUntil(this.destroy$),
        filter((children: SearchResponse<Child[]>) => !!children)
      )
      .subscribe((children: SearchResponse<Child[]>) => {
        this.allUsers = Util.updateStructureForTheTable(children.entities);
        this.totalEntities = children.totalAmount;
      });

    this.store.dispatch([
      new GetChildrenForAdmin(this.childrenParams),
      new PushNavPath({
        name: NavBarName.Users,
        isActive: false,
        disable: true
      })
    ]);
  }

  /**
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    this.filterFormControl.reset();
    this.childrenParams.searchString = '';
    this.childrenParams.tabTitle = event.tab.textLabel;
    this.store.dispatch(new GetChildrenForAdmin(this.childrenParams));
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { role: UserTabsUkrReverse[event.tab.textLabel] }
    });
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeAdminTable(page), new GetChildrenForAdmin(this.childrenParams)]);
  }

  onTableItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetTableItemsPerPage(itemsPerPage), new GetChildrenForAdmin(this.childrenParams)]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}
