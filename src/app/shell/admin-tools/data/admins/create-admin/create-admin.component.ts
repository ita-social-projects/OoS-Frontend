import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, map, switchMap } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared-components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared-constants/constants';
import { NAME_REGEX } from 'shared-constants/regex-constants';
import { FormValidators, ValidationConstants } from 'shared-constants/validation';
import { AdminRoles } from 'shared-enum/admins';
import { CodeficatorCategories } from 'shared-enum/codeficator-categories';
import { NavBarName, PersonalCabinetTitle } from 'shared-enum/enumUA/navigation-bar';
import { AdminsFormTitlesEdit, AdminsFormTitlesNew } from 'shared-enum/enumUA/tech-admin/admins';
import { ModalConfirmationType } from 'shared-enum/modal-confirmation';
import { Role } from 'shared-enum/role';
import { BaseAdmin } from 'shared-models/admin.model';
import { Codeficator } from 'shared-models/codeficator.model';
import { Institution } from 'shared-models/institution.model';
import { NavigationBarService } from 'shared-services/navigation-bar/navigation-bar.service';
import { CreateAdmin, GetAdminById, UpdateAdmin } from 'shared-store/admin.actions';
import { AdminState } from 'shared-store/admin.state';
import { GetAllInstitutions, GetCodeficatorById, GetCodeficatorSearch } from 'shared-store/meta-data.actions';
import { MetaDataState } from 'shared-store/meta-data.state';
import { AddNavPath } from 'shared-store/navigation.actions';
import { RegistrationState } from 'shared-store/registration.state';
import { AreaAdmin } from 'shared/models/area-admin.model';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { AdminFactory } from 'shared/utils/admin.utils';
import { CreateFormComponent } from '../../../../personal-cabinet/shared-cabinet/create-form/create-form.component';

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
  @Select(MetaDataState.institutions)
  public institutions$: Observable<Institution[]>;
  @Select(AdminState.selectedAdmin)
  public selectedAdmin$: Observable<BaseAdmin>;
  @Select(MetaDataState.codeficatorSearch)
  public codeficatorSearch$: Observable<Codeficator[]>;

  public readonly Constants = Constants;
  public readonly ValidationConstants = ValidationConstants;

  public adminFormGroup: FormGroup;
  public adminRole: AdminRoles;
  public adminId: string;
  public formTitle: string;
  public regions$: Observable<Codeficator[]>;
  public isRegionSelected: boolean;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private router: Router
  ) {
    super(store, route, navigationBarService);

    this.adminFormGroup = this.formBuilder.group({
      lastName: new FormControl('', defaultValidators),
      firstName: new FormControl('', defaultValidators),
      middleName: new FormControl('', defaultValidators.slice(1)),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
      institution: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, FormValidators.email])
    });
    this.adminRole = AdminRoles[this.route.snapshot.paramMap.get('param')];

    if (this.isRegionAdmin || this.isAreaAdmin) {
      this.adminFormGroup.addControl('region', new FormControl(undefined, Validators.required));
    }

    if (this.isAreaAdmin) {
      this.adminFormGroup.addControl('territorialCommunity', new FormControl('', Validators.required));
      this.initRegionListener();
    }

    this.subscribeOnDirtyForm(this.adminFormGroup);
  }

  public get institutionFormControl(): FormControl {
    return this.adminFormGroup.get('institution') as FormControl;
  }

  public get regionFormControl(): FormControl {
    return this.adminFormGroup.get('region') as FormControl;
  }

  public get territorialCommunityFormControl(): FormControl {
    return this.adminFormGroup.get('territorialCommunity') as FormControl;
  }

  public get isRegionAdmin(): boolean {
    return this.adminRole === AdminRoles.regionAdmin;
  }

  public get isAreaAdmin(): boolean {
    return this.adminRole === AdminRoles.areaAdmin;
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetAllInstitutions(true));
    if (this.isRegionAdmin || this.isAreaAdmin) {
      this.regions$ = this.store.dispatch(new GetCodeficatorSearch('', [CodeficatorCategories.Level1])).pipe(
        takeUntil(this.destroy$),
        map((state) => [...state.metaDataState.codeficatorSearch])
      );
    }

    this.determineEditMode();
    this.formTitle = this.editMode ? AdminsFormTitlesEdit[this.adminRole] : AdminsFormTitlesNew[this.adminRole];
  }

  public determineEditMode(): void {
    this.editMode = Boolean(this.route.snapshot.paramMap.get('id'));
    this.addNavPath();

    if (this.editMode) {
      this.setEditMode();
    }
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
        this.adminFormGroup.patchValue(admin, { emitEvent: false });
        this.institutionFormControl.setValue(
          {
            id: admin.institutionId,
            title: admin.institutionTitle
          },
          { emitEvent: false }
        );

        if (this.isRegionAdmin) {
          this.fillRegion(admin as RegionAdmin);
        }

        if (this.isAreaAdmin) {
          this.fillTerritorialCommunity(admin as AreaAdmin);
        }
      });
  }

  public compareInstitutions(institution1: Institution, institution2: Institution): boolean {
    return institution1.id === institution2.id;
  }

  public compareCodeficators(codeficator1: Codeficator, codeficator2: Codeficator): boolean {
    return codeficator1.id === codeficator2.id;
  }

  public addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const personalCabinetTitle = PersonalCabinetTitle[userRole];

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

  public onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: this.editMode ? ModalConfirmationType.updateAdmin : ModalConfirmationType.createAdmin
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result: boolean) => result))
      .subscribe(() => {
        this.saveAdmin();
      });
  }

  public onCancel(): void {
    this.router.navigate(['/admin-tools/data/admins'], {
      queryParams: { role: this.adminRole }
    });
  }

  private initRegionListener(): void {
    this.regionFormControl.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((value: Codeficator) => {
      this.isRegionSelected = value.category === CodeficatorCategories.Region;
      this.territorialCommunityFormControl.setValue(this.isRegionSelected ? '' : value.id);

      this.store.dispatch(new GetCodeficatorSearch('', [CodeficatorCategories.TerritorialCommunity], value.id));
    });
  }

  private fillRegion(admin: RegionAdmin): void {
    this.regionFormControl.setValue(
      {
        id: admin.catottgId,
        fullName: admin.catottgName
      },
      { emitEvent: false }
    );
  }

  private fillTerritorialCommunity(admin: AreaAdmin): void {
    this.store
      .dispatch(new GetCodeficatorById(admin.catottgId))
      .pipe(
        takeUntil(this.destroy$),
        switchMap((state) =>
          this.store.dispatch(new GetCodeficatorSearch(state.metaDataState.codeficator.region, [CodeficatorCategories.Level1]))
        )
      )
      .subscribe((state) => {
        const { id: regionId, fullName: regionName, category } = state.metaDataState.codeficatorSearch[0];

        this.regionFormControl.setValue(
          {
            id: regionId,
            fullName: regionName
          },
          { emitEvent: false }
        );
        this.isRegionSelected = category === CodeficatorCategories.Region;

        if (this.isRegionSelected) {
          this.store.dispatch(new GetCodeficatorSearch('', [CodeficatorCategories.TerritorialCommunity], regionId));
        }
      });
    this.territorialCommunityFormControl.setValue(
      {
        id: admin.catottgId,
        territorialCommunity: admin.catottgName
      },
      { emitEvent: false }
    );
  }

  private saveAdmin(): void {
    const regionId = this.regionFormControl?.value?.id || null;
    const territorialCommunityId = this.territorialCommunityFormControl?.value?.id || null;
    const admin = AdminFactory.createAdmin(
      this.adminRole,
      this.adminFormGroup.value,
      this.institutionFormControl.value.id,
      regionId,
      territorialCommunityId,
      this.adminId
    );

    this.store.dispatch(this.editMode ? new UpdateAdmin(admin, this.adminRole) : new CreateAdmin(admin, this.adminRole));
  }
}
