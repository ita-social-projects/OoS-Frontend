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
import { PaginationElement } from 'shared-models/paginationElement.model';
import { SearchResponse } from 'shared-models/search.model';
import { BlockData, UsersTable } from 'shared-models/usersTable';
import { BlockAdminById, DeleteAdminById, GetAllAdmins } from 'shared-store/admin.actions';
import { AdminState } from 'shared-store/admin.state';
import { RegistrationState } from 'shared-store/registration.state';
import { Util } from 'shared-utils/utils';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { canManageInstitution, canManageRegion } from 'shared/utils/admin.utils';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit, OnDestroy {
  public readonly noAdmins = NoResultsTitle.noAdmins;
  public readonly AdminRolesTitles = AdminRolesTitles;
  public readonly AdminRoles = AdminRoles;
  public readonly Role = Role;
  public readonly statusesTitles = UserStatusesTitles;
  public readonly canManageInstitution = canManageInstitution;
  public readonly canManageRegion = canManageRegion;

  @Select(AdminState.admins)
  private admins$: Observable<SearchResponse<BaseAdmin[]>>;
  @Select(AdminState.isLoading)
  public isLoadingCabinet$: Observable<boolean>;
  @Select(RegistrationState.role)
  private role$: Observable<string>;

  public tabIndex: number;
  public filterFormControl: FormControl = new FormControl('');
  public adminsTable: UsersTable[];
  public role: Role;
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public totalEntities: number;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public displayedColumns: string[] = ['pib', 'email', 'phone', 'institution', 'status'];
  public adminParams: BaseAdminParameters = {
    searchString: '',
    tabTitle: null,
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };

  constructor(private store: Store, private router: Router, private route: ActivatedRoute, protected matDialog: MatDialog) {}

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

  private setTabOptions(): void {
    const role = this.route.snapshot.queryParamMap.get('role');
    this.adminParams.tabTitle = role ? AdminRoles[role] : this.getDefaultSearchRole();
    this.tabIndex = this.getTabIndexFromRole(role);
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

  private get adminType(): AdminRoles {
    return this.adminParams.tabTitle as AdminRoles;
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
      if (this.adminParams.tabTitle === AdminRoles.ministryAdmin && isActionsInList) {
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
  public onBlock(admin: BlockData): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: admin.isBlocked ? ModalConfirmationType.blockAdmin : ModalConfirmationType.unBlockAdmin
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.blockAdmin(admin, this.adminType);
    });
  }

  private blockAdmin(blockData: BlockData, admin: AdminRoles): void {
    this.store.dispatch(new BlockAdminById({ adminId: blockData.user.id, isBlocked: blockData.isBlocked }, admin));
  }

  /**
   * This method delete Admin By Id
   */
  public onDelete(admin: UsersTable): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteAdmin,
        property: admin.pib
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.deleteAdmin(admin.id, this.adminType);
    });
  }

  private deleteAdmin(id: string, admin: AdminRoles): void {
    this.store.dispatch(new DeleteAdminById(id, admin));
  }

  public onUpdate(admin: UsersTable): void {
    this.router.navigate([`update-admin/${this.adminParams.tabTitle}/${admin.id}`]);
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

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getAdmins();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.currentPage = PaginationConstants.firstPage;
    this.adminParams.size = itemsPerPage;
    this.getAdmins();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  private getAdmins(): void {
    Util.setFromPaginationParam(this.adminParams, this.currentPage, this.totalEntities);
    this.store.dispatch(new GetAllAdmins(this.adminType, this.adminParams));
  }
}
