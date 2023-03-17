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
import { MinistryAdmin } from 'shared-models/ministryAdmin.model';
import { NavigationBarService } from 'shared-services/navigation-bar/navigation-bar.service';
import { AdminState } from 'shared-store/admin.state';
import { ClearCodeficatorSearch, GetAllInstitutions, GetCodeficatorSearch } from 'shared-store/meta-data.actions';
import { MetaDataState } from 'shared-store/meta-data.state';
import { AddNavPath } from 'shared-store/navigation.actions';
import { RegistrationState } from 'shared-store/registration.state';
import { CreateFormComponent } from '../../../../personal-cabinet/shared-cabinet/create-form/create-form.component';
import { Util } from 'shared-utils/utils';
import { GetMinistryAdminById, UpdateMinistryAdmin, CreateMinistryAdmin, UpdateRegionAdmin, CreateRegionAdmin, GetRegionAdminById } from 'shared-store/admin.actions';
import { AdminsFormTitlesEdit, AdminsFormTitlesNew } from 'shared-enum/enumUA/tech-admin/admins';
import { CodeficatorCategories } from 'shared-enum/codeficator-categories';
import { BaseAdmin } from 'shared-models/admin.model';
import { Codeficator } from 'shared-models/codeficator.model';
import { RegionAdmin } from 'shared-models/regionAdmin.model';


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
  readonly validationConstants = ValidationConstants;
  public readonly noSettlement = Constants.NO_SETTLEMENT;

  readonly phonePrefix = Constants.PHONE_PREFIX;
  readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  readonly adminsRole = AdminRoles;

  @Select(MetaDataState.institutions)
  institutions$: Observable<Institution[]>;
  @Select(AdminState.selectedAdmin)
  selectedAdmin$: Observable<BaseAdmin>;
  @Select(MetaDataState.codeficatorSearch)
  codeficatorSearch$: Observable<Codeficator[]>;

  AdminFormGroup: FormGroup;
  adminRole: AdminRoles;
  adminId: string;
  formTitle: string;

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
      region: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.adminRole = AdminRoles[this.route.snapshot.paramMap.get('param')];
    this.subscribeOnDirtyForm(this.AdminFormGroup);
    this.initRegionListener();
  }

  ngOnInit(): void {
    this.formTitle = this.editMode
      ? AdminsFormTitlesEdit[this.adminRole]
      : AdminsFormTitlesNew[this.adminRole];

    this.store.dispatch(new GetAllInstitutions(true));
    this.determineEditMode();
  }

  private initRegionListener(): void {
    this.AdminFormGroup.get('region').valueChanges
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
    if (typeof codeficator === "string") {
      return codeficator;
    };

    return codeficator.region || codeficator.fullName || codeficator.settlement;
  }

  determineEditMode(): void {
    this.editMode = Boolean(this.route.snapshot.paramMap.get('id'));
    this.addNavPath();

    if (this.editMode) {
      this.setEditMode();
    }
  }

  public get isRegionAdmin(): boolean {
    return this.adminRole === AdminRoles.regionAdmin
  }

  setEditMode(): void {
    this.adminId = this.route.snapshot.paramMap.get('id');
    if(this.isRegionAdmin) {
      this.store.dispatch(new GetRegionAdminById(this.adminId));
    } else {
      this.store.dispatch(new GetMinistryAdminById(this.adminId));
    }

    this.selectedAdmin$
      .pipe(
        takeUntil(this.destroy$),
        filter((admin: BaseAdmin) => !!admin)
      )
      .subscribe((admin: BaseAdmin) => {
        this.AdminFormGroup.patchValue(admin, { emitEvent: false });
        this.AdminFormGroup.get('institution').setValue(
          {
            id: admin.institutionId,
            title: admin.institutionTitle
          },
          { emitEvent: false }
        );
          if(this.adminRole === AdminRoles.regionAdmin) {
            const regAdmin = admin as RegionAdmin;

            this.AdminFormGroup.get('region').setValue(
              {
                id: regAdmin.catottgId,
                fullName: regAdmin.catottgName
              },
              { emitEvent: false }
            );
          }
      });
  }

  compareInstitutions(institution1: Institution, institution2: Institution): boolean {
    return institution1.id === institution2.id;
  }

  addNavPath(): void {
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

  onBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: this.editMode ? ModalConfirmationType.updateAdmin : ModalConfirmationType.createAdmin
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {      
      if (result) {
        this.saveAdmin();
      }
    });
  }

  private saveAdmin(): void {
    if (this.isRegionAdmin) {      
      const regionAdmin = new RegionAdmin(
        this.AdminFormGroup.value, 
        this.AdminFormGroup.get('institution').value.id, 
        this.AdminFormGroup.get('region').value.id,
        this.adminId
      );
      this.store.dispatch(this.editMode ? new UpdateRegionAdmin(regionAdmin) : new CreateRegionAdmin(regionAdmin));
    } else {
      const ministryAdmin = new MinistryAdmin(this.AdminFormGroup.value, this.AdminFormGroup.get('institution').value.id, this.adminId);
      this.store.dispatch(this.editMode ? new UpdateMinistryAdmin(ministryAdmin) : new CreateMinistryAdmin(ministryAdmin));
    }
  }
}
