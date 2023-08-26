import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, filter, skip, startWith, takeUntil
} from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import { PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { EmailConfirmationStatusesTitles } from 'shared/enum/enumUA/statuses';
import { UserTabsTitles } from 'shared/enum/enumUA/user';
import { UserTabParams } from 'shared/enum/role';
import { Child, ChildrenParameters } from 'shared/models/child.model';
import { PaginationElement } from 'shared/models/paginationElement.model';
import { SearchResponse } from 'shared/models/search.model';
import { UsersTable } from 'shared/models/usersTable';
import { GetChildrenForAdmin } from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  readonly UserTabsTitles = UserTabsTitles;
  readonly noUsers = NoResultsTitle.noUsers;
  readonly statusesTitles = EmailConfirmationStatusesTitles;

  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(AdminState.children)
  children$: Observable<SearchResponse<Child[]>>;

  filterFormControl = new FormControl('');
  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex: number;
  allUsers: UsersTable[] = [];
  totalEntities: number;
  displayedColumns: string[] = ['pib', 'email', 'phone', 'role', 'status'];
  currentPage: PaginationElement = PaginationConstants.firstPage;
  childrenParams: ChildrenParameters = {
    searchString: '',
    isParent: null,
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };

  constructor(public store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getChildren();

    this.filterFormControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(2000), takeUntil(this.destroy$))
      .subscribe((searchString: string) => {
        this.childrenParams.searchString = searchString;
        this.currentPage = PaginationConstants.firstPage;
        this.getChildren();
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

    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Users,
        isActive: false,
        disable: true
      })
    );
  }

  /**
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    const tabIndex = event.index;
    this.filterFormControl.reset('', { emitEvent: false });
    this.childrenParams.searchString = '';
    if (tabIndex !== UserTabParams.all) {
      this.childrenParams.isParent = UserTabParams.child !== tabIndex;
    } else {
      this.childrenParams.isParent = null;
    }

    this.currentPage = PaginationConstants.firstPage;
    this.getChildren();
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { role: UserTabParams[tabIndex] }
    });
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getChildren();
  }

  onTableItemsPerPageChange(itemsPerPage: number): void {
    this.childrenParams.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  private getChildren(): void {
    Util.setFromPaginationParam(this.childrenParams, this.currentPage, this.totalEntities);
    this.store.dispatch(new GetChildrenForAdmin(this.childrenParams));
  }
}
