import { UserStatuses, UserStatusesTitles } from './../../../../shared/enum/statuses';
import { MinistryAdmin, MinistryAdminParameters } from './../../../../shared/models/ministryAdmin.model';
import { debounceTime, distinctUntilChanged, filter, takeUntil, startWith, skip } from 'rxjs/operators';
import { AdminState } from './../../../../shared/store/admin.state';
import { BlockMinistryAdminById, DeleteMinistryAdminById, GetAllMinistryAdmins } from './../../../../shared/store/admin.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { PaginationConstants, Constants } from '../../../../shared/constants/constants';
import { AdminRole } from '../../../../shared/enum/admins';
import { AdminRoleUkr, AdminRoleUkrReverse } from '../../../../shared/enum/enumUA/admins';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { Role } from '../../../../shared/enum/role';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { BlockData, UsersTable } from '../../../../shared/models/usersTable';
import { PushNavPath, PopNavPath } from '../../../../shared/store/navigation.actions';
import { Util } from '../../../../shared/utils/utils';
import { SearchResponse } from '../../../../shared/models/search.model';
import { RegistrationState } from './../../../../shared/store/registration.state';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit, OnDestroy {
  readonly noAdmins = NoResultsTitle.noAdmins;
  readonly adminRole = AdminRole;
  readonly adminRoleUkr = AdminRoleUkr;
  readonly Role = Role;
  readonly statusesTitles = UserStatusesTitles;

  @Select(AdminState.ministryAdmins)
  ministryAdmins$: Observable<SearchResponse<MinistryAdmin[]>>;
  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(RegistrationState.role)
  role$: Observable<string>;

  tabIndex: number;
  filterFormControl: FormControl = new FormControl('');
  ministryAdminsTable: UsersTable[];
  role: Role;
  destroy$: Subject<boolean> = new Subject<boolean>();
  totalEntities: number;
  currentPage: PaginationElement = PaginationConstants.firstPage;
  displayedColumns: string[] = ['pib', 'email', 'phone', 'institution', 'status'];
  adminParams: MinistryAdminParameters = {
    searchString: '',
    tabTitle: undefined
  };

  constructor(private store: Store, private router: Router, private route: ActivatedRoute, protected matDialog: MatDialog) {}

  ngOnInit(): void {
    const tableItemsPerPage = PaginationConstants.TABLE_ITEM_PER_PAGE;
    Util.setPaginationParams(this.adminParams, this.currentPage, tableItemsPerPage);

    this.setTabOptions();

    this.filterFormControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(2000), takeUntil(this.destroy$))
      .subscribe((searchString: string) => {
        this.adminParams.searchString = searchString;
        this.store.dispatch(new GetAllMinistryAdmins(this.adminParams));
      });

    this.ministryAdmins$.pipe(takeUntil(this.destroy$), filter(Boolean)).subscribe((ministryAdmins: SearchResponse<MinistryAdmin[]>) => {
      this.ministryAdminsTable = Util.updateStructureForTheTableAdmins(ministryAdmins.entities);
      this.totalEntities = ministryAdmins.totalAmount;
    });

    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role: Role) => {
      this.role = role;
      this.setDisplayedColumns();
    });

    this.addNavPath();
  }

  /**
   * This method filter admins according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    this.currentPage = PaginationConstants.firstPage;
    Util.setPaginationParams(this.adminParams, this.currentPage, this.adminParams.size);

    this.filterFormControl.reset();
    this.adminParams.searchString = '';
    this.adminParams.tabTitle = event.tab.textLabel;
    this.store.dispatch(new GetAllMinistryAdmins(this.adminParams));
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { role: AdminRoleUkrReverse[event.tab.textLabel] }
    });
    this.setDisplayedColumns();
  }

  private setTabOptions(): void {
    const queryRole = this.route.snapshot.queryParamMap.get('role');
    this.adminParams.tabTitle = queryRole ? AdminRoleUkr[queryRole] : AdminRoleUkr.ministryAdmin;

    switch (queryRole) {
      case undefined:
      case AdminRole.ministryAdmin:
        this.tabIndex = 0;
        break;
      case AdminRole.regionAdmin:
        this.tabIndex = 1;
        break;
      case AdminRole.territorialCommunityAdmin:
        this.tabIndex = 2;
        break;
    }
  }

  /**
   * This method determines whether the user needs to display actions column depending on his role.
   */
  private setDisplayedColumns(): void {
    const isActionsInList = this.displayedColumns.includes('actions');

    // If the user is a technical administrator and he already has the actions column in the list, exit
    if (this.role === Role.techAdmin && isActionsInList) {
      return;
    }

    // If the user is the ministryAdmin, we check whether he needs to display action column on this table.
    if (this.role === Role.ministryAdmin) {
      //If a table is selected that the user cannot edit and the actions column is added - delete column
      //If a table is selected that the user can edit and the actions column is added, exit.
      if (this.adminParams.tabTitle === AdminRoleUkr.ministryAdmin && isActionsInList) {
        this.displayedColumns = this.displayedColumns.filter((value: string) => value !== 'actions');
        return;
      } else if (isActionsInList) {
        return;
      }
    }

    //In all other cases, add an actions column
    this.displayedColumns.push('actions');
  }

  /**
   * This method block, unBlock Admin By Id
   */
  onBlock(admin: BlockData): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: admin.isBlocked ? ModalConfirmationType.blockMinistryAdmin : ModalConfirmationType.unBlockMinistryAdmin,
        property: admin.user.pib
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result &&
        this.store.dispatch(
          new BlockMinistryAdminById({
            ministryAdminId: admin.user.id,
            isBlocked: admin.isBlocked
          })
        );
    });
  }

  /**
   * This method delete Admin By Id
   */
  onDelete(admin: UsersTable): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteMinistryAdmin,
        property: admin.pib
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.store.dispatch(new DeleteMinistryAdminById(admin.id));
    });
  }

  onUpdate(admin: UsersTable): void {
    this.router.navigate([`update-admin/ministryAdmin/${admin.id}`]);
  }

  private addNavPath(): void {
    this.store.dispatch([
      new GetAllMinistryAdmins(this.adminParams),
      new PushNavPath({
        name: NavBarName.Admins,
        isActive: false,
        disable: true
      })
    ]);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    Util.setPaginationParams(this.adminParams, page, this.adminParams.size);
    this.store.dispatch(new GetAllMinistryAdmins(this.adminParams));
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    Util.setPaginationParams(this.adminParams, this.currentPage, itemsPerPage);
    this.store.dispatch(new GetAllMinistryAdmins(this.adminParams));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}
