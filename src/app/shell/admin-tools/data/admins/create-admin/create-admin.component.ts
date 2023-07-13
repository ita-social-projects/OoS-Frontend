import { debounceTime, distinctUntilChanged, filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';

import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { NAME_REGEX } from 'shared-constants/regex-constants';
import { ConfirmationModalWindowComponent } from 'shared-components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared-constants/constants';
import { ValidationConstants } from 'shared-constants/validation';
import { AdminRoles } from 'shared-enum/admins';
import { ModalConfirmationType } from 'shared-enum/modal-confirmation';
import { NavBarName } from 'shared-enum/enumUA/navigation-bar';
import { Role } from 'shared-enum/role';
import { Institution } from 'shared-models/institution.model';
import { NavigationBarService } from 'shared-services/navigation-bar/navigation-bar.service';
import { AdminState } from 'shared-store/admin.state';
import { ClearCodeficatorSearch, GetAllInstitutions, GetCodeficatorSearch } from 'shared-store/meta-data.actions';
import { MetaDataState } from 'shared-store/meta-data.state';
import { AddNavPath } from 'shared-store/navigation.actions';
import { RegistrationState } from 'shared-store/registration.state';
import { CreateFormComponent } from '../../../../personal-cabinet/shared-cabinet/create-form/create-form.component';
import { Util } from 'shared-utils/utils';
import { GetAdminById, UpdateAdmin, CreateAdmin } from 'shared-store/admin.actions';
import { AdminsFormTitlesEdit, AdminsFormTitlesNew } from 'shared-enum/enumUA/tech-admin/admins';
import { CodeficatorCategories } from 'shared-enum/codeficator-categories';
import { BaseAdmin } from 'shared-models/admin.model';
import { Codeficator } from 'shared-models/codeficator.model';
import { RegionAdmin } from 'shared-models/regionAdmin.model';
import { AdminFactory } from 'shared/utils/admin.factory';


const defaultValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(NAME_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
];
@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss']
})
export class CreateAdminComponent extends CreateFormComponent implements OnInit, OnDestroy {
  public readonly validationConstants = ValidationConstants;
  public readonly noSettlement = Constants.NO_SETTLEMENT;

  public readonly phonePrefix = Constants.PHONE_PREFIX;
  public readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;

  @Select(MetaDataState.institutions)
  public institutions$: Observable<Institution[]>;
  @Select(AdminState.selectedAdmin)
  public selectedAdmin$: Observable<BaseAdmin>;
  @Select(MetaDataState.codeficatorSearch)
  public codeficatorSearch$: Observable<Codeficator[]>;

  public AdminFormGroup: FormGroup;
  public adminRole: AdminRoles;
  public adminId: string;
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

    this.AdminFormGroup = this.formBuilder.group({
      lastName: new FormControl('', defaultValidators),
      firstName: new FormControl('', defaultValidators),
      middleName: new FormControl('', [
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
      institution: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.adminRole = AdminRoles[this.route.snapshot.paramMap.get('param')];
    this.subscribeOnDirtyForm(this.AdminFormGroup);
    if (this.isRegionAdmin) {
      this.AdminFormGroup.addControl('region', new FormControl('', [Validators.required]));
      this.initRegionListener();
    }
  }

  public ngOnInit(): void {
    this.formTitle = this.editMode
      ? AdminsFormTitlesEdit[this.adminRole]
      : AdminsFormTitlesNew[this.adminRole];

    this.store.dispatch(new GetAllInstitutions(true));
    this.determineEditMode();
  }

  public get regionFormControl(): FormControl {
    return <FormControl> this.AdminFormGroup.get('region');
  }

  public get institutionFormControl(): FormControl {
    return <FormControl> this.AdminFormGroup.get('institution');
  }

  private initRegionListener(): void {
    this.regionFormControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        takeUntil(this.destroy$),
        tap((value: string) => {
          if (!value) {
            this.store.dispatch(new ClearCodeficatorSearch());
          }
        }),
        filter((value: string) => value?.length > 2)
      )
      .subscribe((value: string) => this.store.dispatch(new GetCodeficatorSearch(value, [CodeficatorCategories.Level1])));
  }

  public displayRegionNameFn(codeficator: Codeficator | string): string {
    if (typeof codeficator === 'string') {
      return codeficator;
    };

    return codeficator.region || codeficator.fullName || codeficator.settlement;
  }

  public determineEditMode(): void {
    this.editMode = Boolean(this.route.snapshot.paramMap.get('id'));
    this.addNavPath();

    if (this.editMode) {
      this.setEditMode();
    }
  }

  public get isRegionAdmin(): boolean {
    return this.adminRole === AdminRoles.regionAdmin;
  }

  public setEditMode(): void {
    this.adminId = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new GetAdminById(this.adminId, this.adminRole));

    this.selectedAdmin$
      .pipe(
        takeUntil(this.destroy$),
        filter((admin: BaseAdmin) => !!admin)
      )
      .subscribe((admin: BaseAdmin) => {
        this.AdminFormGroup.patchValue(admin, { emitEvent: false });
        this.institutionFormControl.setValue(
          {
            id: admin.institutionId,
            title: admin.institutionTitle
          },
          { emitEvent: false }
        );
        if (this.isRegionAdmin) {
          this.fillRegion(<RegionAdmin>admin)
        }
      });
  }

  private fillRegion(admin: RegionAdmin): void {
    this.regionFormControl.setValue(
      {
        id: admin.catottgId,
        fullName: admin.catottgName
      }, { emitEvent: false });
  }

  public compareInstitutions(institution1: Institution, institution2: Institution): boolean {
    return institution1.id === institution2.id;
  }

  public addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const subRole = this.store.selectSnapshot<Role>(RegistrationState.subrole);
    const personalCabinetTitle = Util.getPersonalCabinetTitle(userRole, subRole);

    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: personalCabinetTitle,
            path: '/admin-tools/data/admins',
            isActive: false,
            disable: false
          },
          {
            name: this.editMode ? NavBarName.UpdateAdmin : NavBarName.CreateAdmin,
            isActive: false,
            disable: true
          }
        )
      )
    );
  }

  public onBack(): void {
    this.location.back();
  }

  public onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: this.editMode ? ModalConfirmationType.updateAdmin : ModalConfirmationType.createAdmin
      }
    });

    dialogRef.afterClosed().pipe(filter((result: boolean)=>result)).subscribe(() => {
      this.saveAdmin();
    });
  }

  private saveAdmin(): void {
    const regionId = this.regionFormControl?.value?.id || null;
    const admin = AdminFactory.createAdmin(this.adminRole, this.AdminFormGroup.value, this.institutionFormControl.value.id, regionId, this.adminId)
    this.store.dispatch(this.editMode ? new UpdateAdmin(admin, this.adminRole) : new CreateAdmin(admin, this.adminRole));
  }
}
