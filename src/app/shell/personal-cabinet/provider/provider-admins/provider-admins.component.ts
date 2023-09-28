import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from '../../../../shared/constants/constants';
import { ProviderAdminTitles } from '../../../../shared/enum/enumUA/provider-admin';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NavBarName } from '../../../../shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from '../../../../shared/enum/enumUA/no-results';
import { ProviderAdminParams, ProviderAdminRole } from '../../../../shared/enum/provider-admin';
import { ProviderAdmin, ProviderAdminParameters, ProviderAdminTable } from '../../../../shared/models/providerAdmin.model';
import { PushNavPath } from '../../../../shared/store/navigation.actions';
import { DeleteProviderAdminById, BlockProviderAdminById, ReinviteProviderAdmin } from '../../../../shared/store/provider.actions';
import { ProviderComponent } from '../provider.component';
import { ProviderState } from './../../../../shared/store/provider.state';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { SearchResponse } from '../../../../shared/models/search.model';
import { GetFilteredProviderAdmins } from './../../../../shared/store/provider.actions';
import { BlockData, UsersTable } from './../../../../shared/models/usersTable';
import { UserStatusesTitles } from '../../../../shared/enum/enumUA/statuses';
import { Util } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-provider-admins',
  templateUrl: './provider-admins.component.html',
  styleUrls: ['./provider-admins.component.scss']
})
export class ProviderAdminsComponent extends ProviderComponent implements OnInit, OnDestroy {
  readonly ProviderAdminTitles = ProviderAdminTitles;
  readonly providerAdminRole = ProviderAdminRole;
  readonly noProviderAdmins = NoResultsTitle.noUsers;
  readonly constants = Constants;
  readonly statusesTitles = UserStatusesTitles;

  @Select(ProviderState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(ProviderState.providerAdmins)
  providerAdmins$: Observable<SearchResponse<ProviderAdmin[]>>;
  providerAdmins: SearchResponse<ProviderAdmin[]>;
  providerAdminsData: ProviderAdminTable[] = [];

  filterFormControl: FormControl = new FormControl('');
  currentPage: PaginationElement = PaginationConstants.firstPage;
  tabIndex: number;

  filterParams: ProviderAdminParameters = {
    assistantsOnly: false,
    deputyOnly: false,
    searchString: '',
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };

  constructor(protected store: Store, protected matDialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    super(store, matDialog);
  }

  ngOnInit(): void {
    super.ngOnInit();
    Util.setFromPaginationParam(this.filterParams, this.currentPage, this.providerAdmins?.totalAmount);

    this.route.queryParams.pipe(takeUntil(this.destroy$), debounceTime(500)).subscribe((params: Params) => {
      this.tabIndex = params['role'] ? Object.keys(this.providerAdminRole).indexOf(params['role']) : 0;
      this.filterParams.assistantsOnly = params['role'] === ProviderAdminRole.admin;
      this.filterParams.deputyOnly = params['role'] === ProviderAdminRole.deputy;
      this.currentPage = PaginationConstants.firstPage;
      this.getFilteredProviderAdmins();
    });
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getFilteredProviderAdmins();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.filterParams.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  /**
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    const tabIndex = event.index;
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { role: ProviderAdminParams[tabIndex] }
    });
  }

  /**
   * This method delete provider Admin By Id
   */
  onDelete(user: UsersTable): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: user.isDeputy ? ModalConfirmationType.deleteProviderAdminDeputy : ModalConfirmationType.deleteProviderAdmin,
        property: user.pib
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result &&
        this.store.dispatch(
          new DeleteProviderAdminById(
            {
              userId: user.id,
              providerId: this.provider.id
            },
            this.filterParams
          )
        );
    });
  }

  /**
   * This method block and unBlock provider Admin By Id
   */
  onBlock(admin: BlockData): void {
    let messageType: string;

    if (admin.user.isDeputy) {
      messageType = admin.isBlocked ? ModalConfirmationType.blockProviderAdminDeputy : ModalConfirmationType.unBlockProviderAdminDeputy;
    } else {
      messageType = admin.isBlocked ? ModalConfirmationType.blockProviderAdmin : ModalConfirmationType.unBlockProviderAdmin;
    }

    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: messageType,
        property: admin.user.pib
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result &&
        this.store.dispatch(
          new BlockProviderAdminById(
            {
              userId: admin.user.id,
              providerId: this.provider.id,
              isBlocked: admin.isBlocked
            },
            this.filterParams
          )
        );
    });
  }

  onSendInvitation(providerAdmin: ProviderAdmin): void {
    this.store.dispatch(new ReinviteProviderAdmin(providerAdmin));
  }

  /**
   * This method update provider Admin By Id
   */
  onUpdate(user: ProviderAdminTable): void {
    const userRole = user.isDeputy ? ProviderAdminRole.deputy : ProviderAdminRole.admin;
    this.router.navigate([`update-provider-admin/${userRole}/${user.id}`]);
  }

  protected addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Administration,
        isActive: false,
        disable: true
      })
    );
  }

  protected initProviderData(): void {
    this.addProviderAdminsSubscribtions();
  }

  /**
   * This method updates table according to the received data
   * @param admins ProviderAdmin[]
   */
  private updateStructureForTheTable(admins: ProviderAdmin[]): ProviderAdminTable[] {
    const updatedAdmins = [];
    admins.forEach((admin: ProviderAdmin) => {
      updatedAdmins.push({
        id: admin.id,
        pib: `${admin.lastName} ${admin.firstName} ${admin.middleName}`,
        email: admin.email,
        phoneNumber: `${Constants.PHONE_PREFIX} ${admin.phoneNumber}`,
        role: admin.isDeputy ? ProviderAdminTitles.Deputy : ProviderAdminTitles.Admin,
        status: admin.accountStatus,
        isDeputy: admin.isDeputy
      });
    });
    return updatedAdmins;
  }

  /**
   * This method subscribes on provider admins and filter form control value changing for data filtartion
   */
  private addProviderAdminsSubscribtions(): void {
    this.filterFormControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: string) => {
        this.filterParams.searchString = val;
        this.currentPage = PaginationConstants.firstPage;
        this.getFilteredProviderAdmins();
      });

    this.providerAdmins$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((providerAdmins: SearchResponse<ProviderAdmin[]>) => {
      this.providerAdmins = providerAdmins;
      this.providerAdminsData = this.updateStructureForTheTable(providerAdmins.entities);
    });
  }

  private getFilteredProviderAdmins(): void {
    Util.setFromPaginationParam(this.filterParams, this.currentPage, this.providerAdmins?.totalAmount);
    this.store.dispatch(new GetFilteredProviderAdmins(this.filterParams));
  }
}
