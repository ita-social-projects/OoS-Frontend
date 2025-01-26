import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ReasonModalWindowComponent } from 'shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { EmailConfirmationStatusesTitles } from 'shared/enum/enumUA/statuses';
import { UserTabsTitles } from 'shared/enum/enumUA/user';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { UserTabParams } from 'shared/enum/role';
import { Child, ChildrenParameters } from 'shared/models/child.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { SearchResponse } from 'shared/models/search.model';
import { UsersBlockData, UsersTableData } from 'shared/models/users-table';
import { GetChildrenForAdmin } from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { OnBlockParent, OnUnblockParent } from 'shared/store/parent.actions';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  @Select(AdminState.isLoading)
  public isLoadingCabinet$: Observable<boolean>;
  @Select(AdminState.children)
  private children$: Observable<SearchResponse<Child[]>>;

  public readonly UserTabsTitles = UserTabsTitles;
  public readonly noUsers = NoResultsTitle.noUsers;
  public readonly statusesTitles = EmailConfirmationStatusesTitles;

  public filterFormControl = new FormControl('');
  public tabIndex: number;
  public allUsers: UsersTableData[] = [];
  public totalEntities: number;
  public displayedColumns: string[] = ['pib', 'email', 'phone', 'role', 'status', 'actions'];
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public childrenParams: ChildrenParameters = {
    searchString: '',
    isParent: null,
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.getChildren();

    this.filterFormControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(500), takeUntil(this.destroy$))
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
  public onTabChange(event: MatTabChangeEvent): void {
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

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getChildren();
  }

  public onTableItemsPerPageChange(itemsPerPage: number): void {
    this.childrenParams.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public onBlockUnblock(parent: UsersBlockData): void {
    if (parent.isBlocking) {
      this.matDialog
        .open(ReasonModalWindowComponent, {
          data: { type: ModalConfirmationType.blockParent }
        })
        .afterClosed()
        .pipe(
          filter(Boolean),
          switchMap((result: string) =>
            this.store.dispatch(
              new OnBlockParent({
                parentId: parent.user.parentId,
                isBlocked: true,
                reason: result
              })
            )
          ),
          switchMap(() => this.store.dispatch(new GetChildrenForAdmin(this.childrenParams)))
        )
        .subscribe();
    } else {
      this.matDialog
        .open(ConfirmationModalWindowComponent, {
          width: Constants.MODAL_SMALL,
          data: {
            type: ModalConfirmationType.unBlockParent,
            property: parent.user.parentFullName
          }
        })
        .afterClosed()
        .pipe(
          filter(Boolean),
          switchMap(() =>
            this.store.dispatch(
              new OnUnblockParent({
                parentId: parent.user.parentId,
                isBlocked: false
              })
            )
          ),
          switchMap(() => this.store.dispatch(new GetChildrenForAdmin(this.childrenParams)))
        )
        .subscribe();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  private getChildren(): void {
    Util.setFromPaginationParam(this.childrenParams, this.currentPage, this.totalEntities);
    this.store.dispatch(new GetChildrenForAdmin(this.childrenParams));
  }
}
