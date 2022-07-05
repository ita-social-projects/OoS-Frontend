import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  takeUntil,
} from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import {
  providerAdminRoleUkr,
  providerAdminRoleUkrReverse,
} from 'src/app/shared/enum/enumUA/provider-admin';
import { Provider } from 'src/app/shared/models/provider.model';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { providerAdminRole } from 'src/app/shared/enum/provider-admin';
import {
  ProviderAdmin,
  ProviderAdminTable,
} from 'src/app/shared/models/providerAdmin.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import {
  BlockProviderAdminById,
  DeleteProviderAdminById,
  GetAllProviderAdmins,
} from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { Role } from 'src/app/shared/enum/role';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-provider-admins',
  templateUrl: './provider-admins.component.html',
  styleUrls: ['./provider-admins.component.scss'],
})
export class ProviderAdminsComponent implements OnInit {
  readonly providerAdminRoleUkr = providerAdminRoleUkr;
  readonly providerAdminRole = providerAdminRole;
  readonly noProviderAdmins = NoResultsTitle.noUsers;
  readonly constants: typeof Constants = Constants;

  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(UserState.providerAdmins)
  providerAdmins$: Observable<ProviderAdmin[]>;
  providerAdmins: ProviderAdminTable[] = [];
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  provider: Provider;
  filter = new FormControl('');
  filterValue: string;
  btnView: string = providerAdminRoleUkr.all;
  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex: number;
  subrole: string;
  Role = Role;

  constructor(
    public store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filter.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(200), distinctUntilChanged())
      .subscribe((val: string) => {
        if (val) {
          this.filterValue = val;
        } else {
          this.filterValue = '';
        }
      });
    this.getAllProviderAdmins();

    this.providerAdmins$
      .pipe(
        filter((providerAdmins: ProviderAdmin[]) => !!providerAdmins),
        takeUntil(this.destroy$)
      )
      .subscribe((providerAdmins: ProviderAdmin[]) => {
        this.providerAdmins = this.updateStructureForTheTable(providerAdmins);
      });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.tabIndex = Object.keys(this.providerAdminRole).indexOf(params['role']);
      });

    this.provider$
      .pipe(
        filter((provider: Provider) => !!provider),
        takeUntil(this.destroy$)
      )
      .subscribe((provider: Provider) => (this.provider = provider));

    this.subrole = this.store.selectSnapshot<string>(RegistrationState.subrole);
  }

  getAllProviderAdmins(): void {
    this.store.dispatch(new GetAllProviderAdmins());
  }

  updateStructureForTheTable(admins: ProviderAdmin[]): ProviderAdminTable[] {
    let updatedAdmins = [];
    admins.forEach((admin) => {
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
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    this.btnView = event.tab.textLabel;
    this.filter.reset();
    this.router.navigate(['./'], { relativeTo: this.route, queryParams: { role: providerAdminRoleUkrReverse[event.tab.textLabel] } }
    );
  }

  /**
   * This method delete provider Admin By Id
   */
  onDelete(user): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: user.deputy
          ? ModalConfirmationType.deleteProviderAdminDeputy
          : ModalConfirmationType.deleteProviderAdmin,
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
        type: user.deputy
          ? ModalConfirmationType.blockProviderAdminDeputy
          : ModalConfirmationType.blockProviderAdmin,
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
}
