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
import { providerAdminRoleUkr, providerAdminRoleUkrReverse } from '../../../../shared/enum/enumUA/provider-admin';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { ProviderAdminRole } from '../../../../shared/enum/provider-admin';
import { ProviderAdmin, ProviderAdminParameters, ProviderAdminTable } from '../../../../shared/models/providerAdmin.model';
import { PushNavPath } from '../../../../shared/store/navigation.actions';
import { DeleteProviderAdminById, BlockProviderAdminById } from '../../../../shared/store/provider.actions';
import { ProviderComponent } from '../provider.component';
import { ProviderState } from './../../../../shared/store/provider.state';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { SearchResponse } from '../../../../shared/models/search.model';
import { PaginatorState } from '../../../../shared/store/paginator.state';
import { OnPageChange, SetTableItemsPerPage } from '../../../../shared/store/paginator.actions';
import { GetFilteredProviderAdmins } from './../../../../shared/store/provider.actions';
import { BlockData, UsersTable } from './../../../../shared/models/usersTable';
import { UserStatusesTitles } from '../../../../shared/enum/statuses';

@Component({
  selector: 'app-provider-admins',
  templateUrl: './provider-admins.component.html',
  styleUrls: ['./provider-admins.component.scss']
})
export class ProviderAdminsComponent extends ProviderComponent implements OnInit, OnDestroy {
  readonly providerAdminRoleUkr = providerAdminRoleUkr;
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
  @Select(PaginatorState.tableItemsPerPage)
  tableItemsPerPage$: Observable<number>;

  filterFormControl: FormControl = new FormControl('');
  currentPage: PaginationElement = PaginationConstants.firstPage;
  tabIndex: number;

  private filterParams: ProviderAdminParameters = {
    assistantsOnly: false,
    deputyOnly: false,
    searchString: ''
  };

  constructor(protected store: Store, protected matDialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    super(store, matDialog);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.tabIndex = params['role'] ? Object.keys(this.providerAdminRole).indexOf(params['role']) : 0;
      this.filterParams.assistantsOnly = params['role'] === ProviderAdminRole.admin;
      this.filterParams.deputyOnly = params['role'] === ProviderAdminRole.deputy;
      this.getFilteredProviderAdmins();
    });
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChange(page), new GetFilteredProviderAdmins(this.filterParams)]);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetTableItemsPerPage(itemsPerPage), new GetFilteredProviderAdmins(this.filterParams)]);
  }

  /**
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { role: providerAdminRoleUkrReverse[event.tab.textLabel] }
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

  /**
   * This method update provider Admin By Id
   */
  onUpdate(user: ProviderAdminTable): void {
    this.router.navigate([`update-provider-admin/${providerAdminRoleUkrReverse[user.role]}/${user.id}`]);
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

  private getFilteredProviderAdmins(): void {
    this.store.dispatch(new GetFilteredProviderAdmins(this.filterParams));
  }

  /**
   * This method updates table according to teh received data
   * @param admins: ProviderAdmin[]
   */
  private updateStructureForTheTable(admins: ProviderAdmin[]): ProviderAdminTable[] {
    const updatedAdmins = [];
    admins.forEach((admin: ProviderAdmin) => {
      updatedAdmins.push({
        id: admin.id,
        pib: `${admin.lastName} ${admin.firstName} ${admin.middleName}`,
        email: admin.email,
        phoneNumber: `${Constants.PHONE_PREFIX} ${admin.phoneNumber}`,
        role: admin.isDeputy ? providerAdminRoleUkr.deputy : providerAdminRoleUkr.admin,
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
        this.getFilteredProviderAdmins();
      });

    this.providerAdmins$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((providerAdmins: SearchResponse<ProviderAdmin[]>) => {
      this.providerAdmins = providerAdmins;
      this.providerAdminsData = this.updateStructureForTheTable(providerAdmins.entities);
    });
  }
}
