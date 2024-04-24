import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { NAME_REGEX } from 'shared/constants/regex-constants';
import { FormValidators, ValidationConstants } from 'shared/constants/validation';
import { WorkshopDeclination } from 'shared/enum/enumUA/declinations/declination';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { ProviderAdminsFormTitlesEdit, ProviderAdminsFormTitlesNew } from 'shared/enum/enumUA/provider-admin';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { ProviderAdminRole } from 'shared/enum/provider-admin';
import { Role, Subrole } from 'shared/enum/role';
import { TruncatedItem } from 'shared/models/item.model';
import { ProviderAdmin } from 'shared/models/provider-admin.model';
import { Provider } from 'shared/models/provider.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import { CreateProviderAdmin, GetProviderAdminById, GetWorkshopListByProviderId, UpdateProviderAdmin } from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

const defaultValidators: ValidatorFn[] = [
  Validators.pattern(NAME_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
];

@Component({
  selector: 'app-create-provider-admin',
  templateUrl: './create-provider-admin.component.html',
  styleUrls: ['./create-provider-admin.component.scss']
})
export class CreateProviderAdminComponent extends CreateFormComponent implements OnInit, OnDestroy {
  public readonly validationConstants = ValidationConstants;
  public readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  public readonly WorkshopDeclination = WorkshopDeclination;
  public readonly providerAdminRole = ProviderAdminRole;

  @Select(RegistrationState.provider)
  public provider$: Observable<Provider>;
  @Select(ProviderState.truncated)
  public truncatedItems$: Observable<TruncatedItem[]>;
  @Select(ProviderState.selectedProviderAdmin)
  public providerAdmin$: Observable<ProviderAdmin>;

  private provider: Provider;
  private providerRole: ProviderAdminRole;
  private providerAdminId: string;

  public ProviderAdminFormGroup: FormGroup;
  public managedWorkshopIds: string[];
  public isDeputy: boolean;
  public entityControl = new FormControl();
  public formTitle: string;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private router: Router
  ) {
    super(store, route, navigationBarService);

    this.ProviderAdminFormGroup = this.formBuilder.group({
      lastName: new FormControl('', [Validators.required, ...defaultValidators]),
      firstName: new FormControl('', [Validators.required, ...defaultValidators]),
      middleName: new FormControl('', defaultValidators),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
      email: new FormControl('', [Validators.required, FormValidators.email])
    });

    this.providerRole = ProviderAdminRole[this.route.snapshot.paramMap.get('param')];
    this.isDeputy = this.providerRole === ProviderAdminRole.deputy;

    this.subscribeOnDirtyForm(this.ProviderAdminFormGroup);
  }

  public ngOnInit(): void {
    this.determineEditMode();
    this.provider$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((provider: Provider) => {
      this.provider = provider;
      if (!this.isDeputy) {
        this.store.dispatch(new GetWorkshopListByProviderId(this.provider.id));
      }
    });
  }

  public determineEditMode(): void {
    this.providerAdminId = this.route.snapshot.paramMap.get('id');
    this.editMode = !!this.providerAdminId;
    this.formTitle = this.editMode ? ProviderAdminsFormTitlesEdit[this.providerRole] : ProviderAdminsFormTitlesNew[this.providerRole];
    this.addNavPath();

    if (this.editMode) {
      this.setEditMode();
    }
  }

  public setEditMode(): void {
    const editObservables: Observable<ProviderAdmin | TruncatedItem[]>[] = [this.providerAdmin$.pipe(filter(Boolean))];

    if (!this.isDeputy) {
      editObservables.push(this.truncatedItems$.pipe(filter(Boolean)));
    }

    combineLatest(editObservables)
      .pipe(takeUntil(this.destroy$))
      .subscribe(([providerAdmin, allEntities]: [ProviderAdmin, TruncatedItem[]]) => {
        this.ProviderAdminFormGroup.patchValue(providerAdmin, { emitEvent: false });
        if (allEntities) {
          this.entityControl.setValue(
            allEntities.filter((entity: TruncatedItem) =>
              providerAdmin.workshopTitles.find((checkedEntity: TruncatedItem) => entity.id === checkedEntity.id)
            )
          );
        }
      });

    this.store.dispatch(new GetProviderAdminById(this.providerAdminId));
  }

  public addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const subrole = this.store.selectSnapshot<Subrole>(RegistrationState.subrole);
    const personalCabinetTitle = Util.getPersonalCabinetTitle(userRole, subrole);
    let navBarTitle: string;

    if (this.editMode) {
      navBarTitle = this.isDeputy ? NavBarName.UpdateProviderDeputy : NavBarName.UpdateProviderAdmin;
    } else {
      navBarTitle = this.isDeputy ? NavBarName.CreateProviderDeputy : NavBarName.CreateProviderAdmin;
    }

    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: personalCabinetTitle,
            path: '/personal-cabinet/provider/administration',
            isActive: false,
            disable: false
          },
          {
            name: navBarTitle,
            isActive: false,
            disable: true
          }
        )
      )
    );
  }

  public onWorkshopsSelect(workshopsId: string[]): void {
    this.managedWorkshopIds = workshopsId;
  }

  public onWorkshopsChange(): void {
    this.markFormAsDirtyOnUserInteraction();
  }

  public checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsTouched();
    });
  }

  public onSubmit(): void {
    let confirmationType: string;

    if (this.editMode) {
      confirmationType = this.isDeputy ? ModalConfirmationType.updateProviderAdminDeputy : ModalConfirmationType.updateProviderAdmin;
    } else {
      confirmationType = this.isDeputy ? ModalConfirmationType.createProviderAdminDeputy : ModalConfirmationType.createProviderAdmin;
    }

    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: confirmationType
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        const providerAdmin = new ProviderAdmin(
          this.ProviderAdminFormGroup.value,
          this.isDeputy,
          this.providerAdminId,
          this.managedWorkshopIds,
          this.provider.id
        );
        this.store.dispatch(
          this.editMode ? new UpdateProviderAdmin(this.provider.id, providerAdmin) : new CreateProviderAdmin(providerAdmin)
        );
      });
  }

  public onCancel(): void {
    this.router.navigate(['/personal-cabinet/provider/administration']);
  }

  /**
   * This method makes ProviderAdminFormGroup dirty
   */
  public markFormAsDirtyOnUserInteraction(): void {
    if (!this.ProviderAdminFormGroup.dirty) {
      this.ProviderAdminFormGroup.markAsDirty({ onlySelf: true });
    }
  }
}
