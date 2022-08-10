import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { providerAdminRoleUkr, providerAdminRoleUkrReverse } from 'src/app/shared/enum/enumUA/provider-admin';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { providerAdminRole } from 'src/app/shared/enum/provider-admin';
import { ProviderAdmin, ProviderAdminTable } from 'src/app/shared/models/providerAdmin.model';
import {
  BlockProviderAdminById,
  DeleteProviderAdminById,
  GetAllProviderAdmins,
} from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { Constants } from 'src/app/shared/constants/constants';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { ProviderComponent } from '../provider.component';

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

  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(UserState.providerAdmins)
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
  onDelete(user): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: user.deputy ? ModalConfirmationType.deleteProviderAdminDeputy : ModalConfirmationType.deleteProviderAdmin,
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
  onBlock(user): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: user.deputy ? ModalConfirmationType.blockProviderAdminDeputy : ModalConfirmationType.blockProviderAdmin,
        property: user.pib,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result &&
        this.store.dispatch(
          new BlockProviderAdminById({
            userId: user.id,
            providerId: this.provider.id,
          })
        );
    });
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
    this.addProviderAdmisnSubscribtions();
  }

  private getAllProviderAdmins(): void {
    this.store.dispatch(new GetAllProviderAdmins());
  }

  /**
   * This method updates table according to teh received data
   * @param admins: ProviderAdmin[]
   */
  private updateStructureForTheTable(admins: ProviderAdmin[]): ProviderAdminTable[] {
    let updatedAdmins = [];
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
  private addProviderAdmisnSubscribtions(): void {
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