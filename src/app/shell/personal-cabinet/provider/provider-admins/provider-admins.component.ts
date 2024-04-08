import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ProviderAdminTitles } from 'shared/enum/enumUA/provider-admin';
import { UserStatusesTitles } from 'shared/enum/enumUA/statuses';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { ProviderAdminParams, ProviderAdminRole } from 'shared/enum/provider-admin';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { ProviderAdmin, ProviderAdminParameters } from 'shared/models/provider-admin.model';
import { SearchResponse } from 'shared/models/search.model';
import { ProviderAdminsBlockData, ProviderAdminsTableData } from 'shared/models/users-table';
import { PushNavPath } from 'shared/store/navigation.actions';
import {
  BlockProviderAdminById,
  DeleteProviderAdminById,
  GetFilteredProviderAdmins,
  ReinviteProviderAdmin
} from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';
import { Util } from 'shared/utils/utils';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-admins',
  templateUrl: './provider-admins.component.html',
  styleUrls: ['./provider-admins.component.scss']
})
export class ProviderAdminsComponent extends ProviderComponent implements OnInit, OnDestroy {
  @Select(ProviderState.isLoading)
  public isLoadingCabinet$: Observable<boolean>;
  @Select(ProviderState.providerAdmins)
  private providerAdmins$: Observable<SearchResponse<ProviderAdmin[]>>;

  public readonly ProviderAdminTitles = ProviderAdminTitles;
  public readonly providerAdminRole = ProviderAdminRole;
  public readonly noProviderAdmins = NoResultsTitle.noUsers;
  public readonly constants = Constants;
  public readonly statusesTitles = UserStatusesTitles;

  public providerAdmins: SearchResponse<ProviderAdmin[]>;
  public providerAdminsData: ProviderAdminsTableData[] = [];
  public filterFormControl: FormControl = new FormControl('');
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public tabIndex: number;
  public filterParams: ProviderAdminParameters = {
    assistantsOnly: false,
    deputyOnly: false,
    searchString: '',
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };
  public isSmallMobileView: boolean;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(store, matDialog);
  }

  @HostListener('window: resize', ['$event.target'])
  public onResize(event: Window): void {
    this.isSmallMobileView = event.innerWidth <= 480;
  }

  public ngOnInit(): void {
    super.ngOnInit();
    Util.setFromPaginationParam(this.filterParams, this.currentPage, this.providerAdmins?.totalAmount);

    this.setTabOptions();
    this.getFilteredProviderAdmins();
    this.onResize(window);
  }

  /**
   * This method filter users according to selected tab
   * @param event MatTabChangeEvent
   */
  public onTabChange(event: MatTabChangeEvent): void {
    const providerAdminRoleValues = Object.values(this.providerAdminRole);
    this.currentPage = PaginationConstants.firstPage;
    this.filterFormControl.reset('', { emitEvent: false });
    this.filterParams.searchString = '';
    this.filterParams.from = 0;
    this.filterParams.deputyOnly = providerAdminRoleValues[event.index] === ProviderAdminRole.deputy;
    this.filterParams.assistantsOnly = providerAdminRoleValues[event.index] === ProviderAdminRole.admin;
    this.getFilteredProviderAdmins();
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { role: ProviderAdminParams[event.index] }
    });
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getFilteredProviderAdmins();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.filterParams.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  /**
   * This method update provider Admin By Id
   */
  public onUpdate(user: ProviderAdminsTableData): void {
    const userRole = user.isDeputy ? ProviderAdminRole.deputy : ProviderAdminRole.admin;
    this.router.navigate([`update-provider-admin/${userRole}/${user.id}`]);
  }

  /**
   * This method block and unBlock provider Admin By Id
   */
  public onBlockUnblock(admin: ProviderAdminsBlockData): void {
    let messageType: string;
    if (admin.user.isDeputy) {
      messageType = admin.isBlocking ? ModalConfirmationType.blockProviderAdminDeputy : ModalConfirmationType.unBlockProviderAdminDeputy;
    } else {
      messageType = admin.isBlocking ? ModalConfirmationType.blockProviderAdmin : ModalConfirmationType.unBlockProviderAdmin;
    }

    this.matDialog
      .open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: messageType,
          property: admin.user.pib
        }
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(
          new BlockProviderAdminById(
            {
              userId: admin.user.id,
              providerId: this.provider.id,
              isBlocked: admin.isBlocking
            },
            this.filterParams
          )
        );
      });
  }

  /**
   * This method delete provider Admin By Id
   */
  public onDelete(user: ProviderAdminsTableData): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: user.isDeputy ? ModalConfirmationType.deleteProviderAdminDeputy : ModalConfirmationType.deleteProviderAdmin,
        property: user.pib
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
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

  public onSendInvitation(providerAdmin: ProviderAdmin): void {
    this.store.dispatch(new ReinviteProviderAdmin(providerAdmin));
  }

  protected initProviderData(): void {
    this.addProviderAdminsSubscriptions();
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

  private setTabOptions(): void {
    const role = this.route.snapshot.queryParamMap.get('role');
    this.tabIndex = role ? Object.keys(this.providerAdminRole).indexOf(role) : 0;
    this.filterParams.deputyOnly = role === ProviderAdminRole.deputy;
    this.filterParams.assistantsOnly = role === ProviderAdminRole.admin;
    this.currentPage = PaginationConstants.firstPage;
  }

  private getFilteredProviderAdmins(): void {
    Util.setFromPaginationParam(this.filterParams, this.currentPage, this.providerAdmins?.totalAmount);
    this.store.dispatch(new GetFilteredProviderAdmins(this.filterParams));
  }

  /**
   * This method subscribes on provider admins and filter form control value changing for data filtration
   */
  private addProviderAdminsSubscriptions(): void {
    this.filterFormControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: string) => {
        this.filterParams.searchString = val;
        this.currentPage = PaginationConstants.firstPage;
        this.getFilteredProviderAdmins();
      });

    this.providerAdmins$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((providerAdmins: SearchResponse<ProviderAdmin[]>) => {
      this.providerAdmins = providerAdmins;
      this.providerAdminsData = Util.updateStructureForTheTableProviderAdmins(providerAdmins.entities);
    });
  }
}
