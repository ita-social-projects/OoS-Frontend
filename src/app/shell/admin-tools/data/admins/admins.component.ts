import { MinistryAdmin, MinistryAdminParameters } from './../../../../shared/models/ministryAdmin.model';
import { debounceTime, distinctUntilChanged, filter, takeUntil, startWith, skip } from 'rxjs/operators';
import { AdminState } from './../../../../shared/store/admin.state';
import { BlockMinistryAdminById, BlockRegionAdminById, DeleteMinistryAdminById, DeleteRegionAdminById, GetAllMinistryAdmins, GetAllRegionAdmins } from './../../../../shared/store/admin.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { PaginationConstants, Constants } from '../../../../shared/constants/constants';
import { AdminRoles, AdminRoleTypes } from '../../../../shared/enum/admins';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NavBarName } from '../../../../shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from '../../../../shared/enum/enumUA/no-results';
import { Role } from '../../../../shared/enum/role';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { BlockData, UsersTable } from '../../../../shared/models/usersTable';
import { PushNavPath, PopNavPath } from '../../../../shared/store/navigation.actions';
import { Util } from '../../../../shared/utils/utils';
import { SearchResponse } from '../../../../shared/models/search.model';
import { RegistrationState } from './../../../../shared/store/registration.state';
import { UserStatusesTitles } from '../../../../shared/enum/enumUA/statuses';
import { AdminRolesTitles } from '../../../../shared/enum/enumUA/tech-admin/admins';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit, OnDestroy {
  readonly noAdmins = NoResultsTitle.noAdmins;
  readonly AdminRolesTitles = AdminRolesTitles;
  readonly AdminRoles = AdminRoles;
  readonly Role = Role;
  readonly statusesTitles = UserStatusesTitles;

  @Select(AdminState.ministryAdmins)
  ministryAdmins$: Observable<SearchResponse<MinistryAdmin[]>>;
  @Select(AdminState.regionAdmins)
  regionAdmins$: Observable<SearchResponse<MinistryAdmin[]>>;
  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(RegistrationState.role)
  role$: Observable<string>;

  tabIndex: number;
  filterFormControl: FormControl = new FormControl('');
  ministryAdminsTable: UsersTable[];
  regionAdminsTable: UsersTable[];
  role: Role;
  destroy$: Subject<boolean> = new Subject<boolean>();
  totalEntities: number;
  currentPage: PaginationElement = PaginationConstants.firstPage;
  displayedColumns: string[] = ['pib', 'email', 'phone', 'institution', 'status'];
  adminParams: MinistryAdminParameters = {
    searchString: '',
    tabTitle: null,
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };

  constructor(private store: Store, private router: Router, private route: ActivatedRoute, protected matDialog: MatDialog) {}

  ngOnInit(): void {
    this.setTabOptions();
    this.getAdmins();
    this.setDisplayedColumns();

    this.filterFormControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(2000), takeUntil(this.destroy$))
      .subscribe((searchString: string) => {
        this.adminParams.searchString = searchString;
        this.currentPage = PaginationConstants.firstPage;
        this.getAdmins();
      });

    this.ministryAdmins$.pipe(takeUntil(this.destroy$), filter(Boolean)).subscribe((ministryAdmins: SearchResponse<MinistryAdmin[]>) => {
      this.ministryAdminsTable = Util.updateStructureForTheTableAdmins(ministryAdmins.entities);
      this.totalEntities = ministryAdmins.totalAmount;
    });
    this.regionAdmins$.pipe(takeUntil(this.destroy$), filter(Boolean)).subscribe((regionAdmins: SearchResponse<MinistryAdmin[]>) => {
      this.regionAdminsTable = Util.updateStructureForTheTableAdmins(regionAdmins.entities);
      this.totalEntities = regionAdmins.totalAmount;
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
    this.filterFormControl.reset();
    this.adminParams.searchString = '';
    this.adminParams.from = 0;
    this.adminParams.tabTitle = AdminRoleTypes[event.index];
    this.getAdmins();
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { role: AdminRoleTypes[event.index] }
    });
    this.setDisplayedColumns();
  }

  private setTabOptions(): void {
    const queryRole = this.route.snapshot.queryParamMap.get('role');
    this.adminParams.tabTitle = queryRole ? AdminRoles[queryRole] : AdminRoles.ministryAdmin;
    this.tabIndex = AdminRoleTypes[queryRole];
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
  onBlock(admin: BlockData): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: admin.isBlocked ? ModalConfirmationType.blockAdmin : ModalConfirmationType.unBlockAdmin
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.blockAdmin(admin, this.adminParams.tabTitle as AdminRoles);
    });

  }

  private blockAdmin(blockData: BlockData, admin: AdminRoles): void{
    switch(admin){
      case AdminRoles.regionAdmin: {
        this.store.dispatch(
          new BlockRegionAdminById({
            adminId: blockData.user.id,
            isBlocked: blockData.isBlocked
          })
        );
        break;
      }
      case AdminRoles.ministryAdmin: {
        this.store.dispatch(
          new BlockMinistryAdminById({
            adminId: blockData.user.id,
            isBlocked: blockData.isBlocked
          })
        );
        break;
      }
      default :{
        this.store.dispatch(
          new BlockMinistryAdminById({
            adminId: blockData.user.id,
            isBlocked: blockData.isBlocked
          })
        );
      }
    }
  }

  /**
   * This method delete Admin By Id
   */
  onDelete(admin: UsersTable): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteAdmin,
        property: admin.pib
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.deleteAdmin(admin.id, this.adminParams.tabTitle as AdminRoles)
    });
  }

  private deleteAdmin(id: string, admin: AdminRoles): void {
    switch(admin){
      case AdminRoles.regionAdmin: {
        this.store.dispatch(new DeleteRegionAdminById(id));
        break;
      }
      case AdminRoles.ministryAdmin: {
        this.store.dispatch(new DeleteMinistryAdminById(id));
        break;
      }
      default :{
        this.store.dispatch(new DeleteMinistryAdminById(id));
      }
    }
  }

  onUpdate(admin: UsersTable): void {
    this.router.navigate([`update-admin/${this.adminParams.tabTitle}/${admin.id}`]);
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
    this.getAdmins();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.adminParams.size = itemsPerPage;
    this.getAdmins();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  private getAdmins(): void {
    if(this.adminParams.tabTitle === AdminRoles.regionAdmin) {
      this.store.dispatch(new GetAllRegionAdmins(this.adminParams));
      Util.setFromPaginationParam(this.adminParams, this.currentPage, this.totalEntities);
    } else {
      this.store.dispatch(new GetAllMinistryAdmins(this.adminParams));
      Util.setFromPaginationParam(this.adminParams, this.currentPage, this.totalEntities);
    }
  }
}
