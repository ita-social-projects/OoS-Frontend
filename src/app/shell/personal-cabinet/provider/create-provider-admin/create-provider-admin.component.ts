import { combineLatest, Observable } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, filter, switchMap, take, takeUntil
} from 'rxjs/operators';

import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import {
  ConfirmationModalWindowComponent
} from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../shared/constants/constants';
import { NAME_REGEX } from '../../../../shared/constants/regex-constants';
import { ValidationConstants } from '../../../../shared/constants/validation';
import { WorkshopDeclination } from '../../../../shared/enum/enumUA/declinations/declination';
import { NavBarName } from '../../../../shared/enum/enumUA/navigation-bar';
import {
  ProviderAdminsFormTitlesEdit, ProviderAdminsFormTitlesNew
} from '../../../../shared/enum/enumUA/provider-admin';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { ProviderAdminRole } from '../../../../shared/enum/provider-admin';
import { Role } from '../../../../shared/enum/role';
import { TruncatedItem } from '../../../../shared/models/item.model';
import { Provider } from '../../../../shared/models/provider.model';
import { ProviderAdmin } from '../../../../shared/models/providerAdmin.model';
import {
  NavigationBarService
} from '../../../../shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from '../../../../shared/store/navigation.actions';
import {
  CreateProviderAdmin, GetProviderAdminById, GetWorkshopListByProviderId, UpdateProviderAdmin
} from '../../../../shared/store/provider.actions';
import { ProviderState } from '../../../../shared/store/provider.state';
import { RegistrationState } from '../../../../shared/store/registration.state';
import { Util } from '../../../../shared/utils/utils';
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
  readonly validationConstants = ValidationConstants;
  readonly phonePrefix = Constants.PHONE_PREFIX;
  readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  readonly WorkshopDeclination = WorkshopDeclination;
  readonly providerAdminRole = ProviderAdminRole;

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
    private location: Location
  ) {
    super(store, route, navigationBarService);

    this.ProviderAdminFormGroup = this.formBuilder.group({
      lastName: new FormControl('', [Validators.required, ...defaultValidators]),
      firstName: new FormControl('', [Validators.required, ...defaultValidators]),
      middleName: new FormControl('', defaultValidators),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
      email: new FormControl('', [Validators.required, Validators.email])
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
    const subRole = this.store.selectSnapshot<Role>(RegistrationState.subrole);
    const personalCabinetTitle = Util.getPersonalCabinetTitle(userRole, subRole);
    let navBarTitle: string;

    if (this.editMode) {
      this.isDeputy ? (navBarTitle = NavBarName.UpdateProviderDeputy) : (navBarTitle = NavBarName.UpdateProviderAdmin);
    } else {
      this.isDeputy ? (navBarTitle = NavBarName.CreateProviderDeputy) : (navBarTitle = NavBarName.CreateProviderAdmin);
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

  public checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsTouched();
    });
  }

  public onBack(): void {
    this.location.back();
  }

  public onSubmit(): void {
    let confirmationType: string;

    if (this.editMode) {
      this.isDeputy
        ? (confirmationType = ModalConfirmationType.updateProviderAdminDeputy)
        : (confirmationType = ModalConfirmationType.updateProviderAdmin);
    } else {
      this.isDeputy
        ? (confirmationType = ModalConfirmationType.createProviderAdminDeputy)
        : (confirmationType = ModalConfirmationType.createProviderAdmin);
    }

    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: confirmationType
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
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
      }
    });
  }
}
