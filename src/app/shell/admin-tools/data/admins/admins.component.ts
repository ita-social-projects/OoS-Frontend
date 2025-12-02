import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, switchMap } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, skip, startWith, takeUntil } from 'rxjs/operators';

import { AdminRoles, AdminRoleTypes } from 'shared-enum/admins';
import { NavBarName } from 'shared-enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared-enum/enumUA/no-results';
import { UserStatusesTitles } from 'shared-enum/enumUA/statuses';
import { AdminRolesTitles } from 'shared-enum/enumUA/tech-admin/admins';
import { ModalConfirmationType } from 'shared-enum/modal-confirmation';
import { Role } from 'shared-enum/role';
import { BaseAdmin, BaseAdminParameters } from 'shared-models/admin.model';
import { SearchResponse } from 'shared-models/search.model';
import { BlockAdminById, DeleteAdminById, GetAllAdmins, ReinviteAdminById } from 'shared-store/admin.actions';
import { AdminState } from 'shared-store/admin.state';
import { RegistrationState } from 'shared-store/registration.state';
import { Util } from 'shared-utils/utils';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { AdminsBlockData, AdminsTableData, InvitationData } from 'shared/models/users-table';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { canManageInstitution, canManageRegion } from 'shared/utils/admin.utils';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit, OnDestroy {
  @Select(AdminState.isLoading)
  public isLoadingCabinet$: Observable<boolean>;
  @Select(AdminState.admins)
  private admins$: Observable<SearchResponse<BaseAdmin[]>>;
  @Select(RegistrationState.role)
  private role$: Observable<string>;

  public readonly noAdmins = NoResultsTitle.noAdmins;
  public readonly AdminRolesTitles = AdminRolesTitles;
  public readonly AdminRoles = AdminRoles;
  public readonly Role = Role;
  public readonly statusesTitles = UserStatusesTitles;
  public readonly canManageInstitution = canManageInstitution;
  public readonly canManageRegion = canManageRegion;

  public tabIndex: number;
  public filterFormControl: FormControl = new FormControl('');
  public adminsTable: AdminsTableData[];
  public role: Role;
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public totalEntities: number;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public displayedColumns: string[] = ['pib', 'email', 'phone', 'institution', 'region', 'territorialCommunity', 'status'];
  public adminParams: BaseAdminParameters = {
    searchString: '',
    tabTitle: null,
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    protected matDialog: MatDialog
  ) {}

  public get adminType(): AdminRoles {
    return this.adminParams.tabTitle as AdminRoles;
  }

  public ngOnInit(): void {
    this.role$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((role: Role) => {
          this.role = role;

          this.setTabOptions();
          this.getAdmins();
          this.setDisplayedColumns();

          return this.admins$;
        }),
        filter(Boolean)
      )
      .subscribe((admins: SearchResponse<BaseAdmin[]>) => {
        this.adminsTable = Util.updateStructureForTheTableAdmins(admins.entities);
        this.totalEntities = admins.totalAmount;
      });

    this.filterFormControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(2000), takeUntil(this.destroy$))
      .subscribe((searchString: string) => {
        this.adminParams.searchString = searchString;
        this.currentPage = PaginationConstants.firstPage;
        this.getAdmins();
      });

    this.addNavPath();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  /**
   * This method filter admins according to selected tab
   * @param event
   */
  public onTabChange(event: MatTabChangeEvent): void {
    this.currentPage = PaginationConstants.firstPage;
    this.filterFormControl.reset('', { emitEvent: false });
    this.adminParams.searchString = '';
    this.adminParams.from = 0;
    this.adminParams.tabTitle = this.getRoleByIndex(event.index);
    this.getAdmins();
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { role: this.getRoleByIndex(event.index) }
    });
    this.setDisplayedColumns();
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getAdmins();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.adminParams.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public onUpdate(admin: AdminsTableData): void {
    this.router.navigate([`update-admin/${this.adminParams.tabTitle}/${admin.id}`]);
  }

  /**
   * This method block, unBlock Admin By Id
   */
  public onBlockUnblock(admin: AdminsBlockData): void {
    this.matDialog
      .open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: admin.isBlocking ? ModalConfirmationType.blockAdmin : ModalConfirmationType.unBlockAdmin
        }
      })
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.blockAdmin(admin, this.adminType);
        }
      });
  }

  /**
   * This method delete Admin By Id
   */
  public onDelete(admin: AdminsTableData): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteAdmin,
        property: admin.pib
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteAdmin(admin.id, this.adminType);
      }
    });
  }

  /**
   * This method send invitation to Admin By Id
   * @param invitationData: InvitationData
   */
  public onSendInvitation(invitationData: InvitationData): void {
    this.store.dispatch(new ReinviteAdminById(invitationData.user.id, invitationData.adminType));
  }

  private setTabOptions(): void {
    const role = this.route.snapshot.queryParamMap.get('role');
    this.adminParams.tabTitle = role ? AdminRoles[role] : this.getDefaultSearchRole();
    this.tabIndex = this.getTabIndexFromRole(role);
  }

  private getAdmins(): void {
    Util.setFromPaginationParam(this.adminParams, this.currentPage, this.totalEntities);
    this.store.dispatch(new GetAllAdmins(this.adminType, this.adminParams));
  }

  /**
   * This method determines whether the user needs to display actions column depending on his role.
   */
  private setDisplayedColumns(): void {
    const isRegionInList = this.displayedColumns.includes('region');
    const isTerritorialCommunityInList = this.displayedColumns.includes('territorialCommunity');
    const isActionsInList = this.displayedColumns.includes('actions');

    if (
      ![AdminRoles.regionAdmin, AdminRoles.areaAdmin].includes(this.adminParams.tabTitle as AdminRoles) ||
      (this.role === Role.regionAdmin && this.adminParams.tabTitle === AdminRoles.areaAdmin)
    ) {
      this.displayedColumns = this.displayedColumns.filter((value: string) => value !== 'region');
    } else if (!isRegionInList) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('institution') + 1, 0, 'region');
    }

    if (this.adminParams.tabTitle !== AdminRoles.areaAdmin) {
      this.displayedColumns = this.displayedColumns.filter((value: string) => value !== 'territorialCommunity');
    } else if (!isTerritorialCommunityInList) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('region') + 1, 0, 'territorialCommunity');
    }

    if (!isActionsInList) {
      this.displayedColumns.push('actions');
    }
  }

  private getRoleByIndex(index: number): string {
    switch (this.role) {
      case Role.ministryAdmin:
        index++;
        break;
      case Role.regionAdmin:
        index += 2;
        break;
    }

    return AdminRoleTypes[index];
  }

  private getDefaultSearchRole(): AdminRoles {
    switch (this.role) {
      case Role.techAdmin:
        return AdminRoles.ministryAdmin;
      case Role.ministryAdmin:
        return AdminRoles.regionAdmin;
      case Role.regionAdmin:
        return AdminRoles.areaAdmin;
    }
  }

  private getTabIndexFromRole(role: string): number {
    const index = AdminRoleTypes[role];

    switch (this.role) {
      case Role.techAdmin:
        return index;
      case Role.ministryAdmin:
        return index - 1;
      case Role.regionAdmin:
        return index - 2;
    }
  }

  private blockAdmin(blockData: AdminsBlockData, admin: AdminRoles): void {
    this.store.dispatch(new BlockAdminById({ adminId: blockData.user.id, isBlocked: blockData.isBlocking }, admin));
  }

  private deleteAdmin(id: string, admin: AdminRoles): void {
    this.store.dispatch(new DeleteAdminById(id, admin));
  }

  private addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Admins,
        isActive: false,
        disable: true
      })
    );
  }
}
