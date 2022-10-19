import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../shared/constants/constants';
import { providerAdminRoleUkr, providerAdminRoleUkrReverse } from '../../../../shared/enum/enumUA/provider-admin';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { providerAdminRole } from '../../../../shared/enum/provider-admin';
import { ProviderAdmin, ProviderAdminTable } from '../../../../shared/models/providerAdmin.model';
import { PushNavPath } from '../../../../shared/store/navigation.actions';
import { DeleteProviderAdminById, BlockProviderAdminById, GetAllProviderAdmins } from '../../../../shared/store/provider.actions';
import { ProviderComponent } from '../provider.component';
import { ProviderState } from './../../../../shared/store/provider.state';

@Component({
  selector: 'app-provider-admins',
  templateUrl: './provider-admins.component.html',
  styleUrls: ['./provider-admins.component.scss'],
})
export class ProviderAdminsComponent extends ProviderComponent implements OnInit, OnDestroy {
  readonly providerAdminRoleUkr = providerAdminRoleUkr;
  readonly providerAdminRole = providerAdminRole;
  readonly noProviderAdmins = NoResultsTitle.noUsers;
  readonly constants = Constants;

  @Select(ProviderState.isLoading)
    isLoadingCabinet$: Observable<boolean>;
  @Select(ProviderState.providerAdmins)
    providerAdmins$: Observable<ProviderAdmin[]>;

  providerAdmins: ProviderAdminTable[] = [];
  filterFormControl: FormControl = new FormControl('');
  filterValue: string;
  tabIndex: number;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(store, matDialog);
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.tabIndex = params['role'] ? Object.keys(this.providerAdminRole).indexOf(params['role']) : 0;
    });
  }

  /**
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    this.filterFormControl.reset();
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { role: providerAdminRoleUkrReverse[event.tab.textLabel] },
    });
  }

  /**
   * This method delete provider Admin By Id
   */
  onDelete(user: ProviderAdminTable): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: (providerAdminRoleUkrReverse[user.role] === 'deputy') ? ModalConfirmationType.deleteProviderAdminDeputy : ModalConfirmationType.deleteProviderAdmin,
        property: user.pib,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result &&
        this.store.dispatch(
          new DeleteProviderAdminById({
            userId: user.id,
            providerId: this.provider.id,
          })
        );
    });
  }

  /**
   * This method block provider Admin By Id
   */
  onBlock(user: ProviderAdminTable): void {
    let messageType: string;
    const isBlocked = user.status === 'Blocked';

    if(providerAdminRoleUkrReverse[user.role] === 'deputy') {
      messageType = isBlocked ? ModalConfirmationType.unBlockProviderAdminDeputy : ModalConfirmationType.blockProviderAdminDeputy;
    } else {
      messageType = isBlocked ? ModalConfirmationType.unBlockProviderAdmin : ModalConfirmationType.blockProviderAdmin;
    }

    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: messageType,
        property: user.pib,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result &&
        this.store.dispatch(
          new BlockProviderAdminById({
            userId: user.id,
            providerId: this.provider.id,
            isBlocked: !isBlocked
          })
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
        disable: true,
      })
    );
  }

  protected initProviderData(): void {
    this.getAllProviderAdmins();
    this.addProviderAdminsSubscribtions();
  }

  private getAllProviderAdmins(): void {
    this.store.dispatch(new GetAllProviderAdmins());
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
      });
    });
    return updatedAdmins;
  }

  /**
   * This method subscribes on provider admins and filter form control value changing for data filtartion
   */
  private addProviderAdminsSubscribtions(): void {
    this.filterFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        distinctUntilChanged(),
        filter((val: string) => !!val)
      )
      .subscribe((val: string) => (this.filterValue = val));

    this.providerAdmins$
      .pipe(
        filter((providerAdmins: ProviderAdmin[]) => !!providerAdmins),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (providerAdmins: ProviderAdmin[]) => (this.providerAdmins = this.updateStructureForTheTable(providerAdmins))
      );
  }
}
