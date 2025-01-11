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
import { NavBarName, PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { EmployeesFormTitlesEdit, EmployeesFormTitlesNew } from 'shared/enum/enumUA/employee';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { EmployeeRole } from 'shared/enum/employee';
import { Role } from 'shared/enum/role';
import { TruncatedItem } from 'shared/models/item.model';
import { Employee } from 'shared/models/employee.model';
import { Provider } from 'shared/models/provider.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import { CreateEmployee, GetEmployeeById, GetWorkshopListByProviderId, UpdateEmployee } from 'shared/store/provider.actions';
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
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.provider)
  public provider$: Observable<Provider>;
  @Select(ProviderState.truncated)
  public truncatedItems$: Observable<TruncatedItem[]>;
  @Select(ProviderState.selectedEmployee)
  public employee$: Observable<Employee>;

  public readonly validationConstants = ValidationConstants;
  public readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  public readonly WorkshopDeclination = WorkshopDeclination;
  public readonly employeeRole = EmployeeRole;

  public EmployeeFormGroup: FormGroup;
  public managedWorkshopIds: string[];
  public isDeputy: boolean;
  public entityControl = new FormControl();
  public formTitle: string;

  private provider: Provider;
  private providerRole: EmployeeRole;
  private employeeId: string;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private router: Router
  ) {
    super(store, route, navigationBarService);

    this.EmployeeFormGroup = this.formBuilder.group({
      lastName: new FormControl('', [Validators.required, ...defaultValidators]),
      firstName: new FormControl('', [Validators.required, ...defaultValidators]),
      middleName: new FormControl('', defaultValidators),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
      email: new FormControl('', [Validators.required, FormValidators.email])
    });

    this.providerRole = EmployeeRole[this.route.snapshot.paramMap.get('param')];
    this.isDeputy = this.providerRole === EmployeeRole.deputy;

    this.subscribeOnDirtyForm(this.EmployeeFormGroup);
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
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.editMode = !!this.employeeId;
    this.formTitle = this.editMode ? EmployeesFormTitlesEdit[this.providerRole] : EmployeesFormTitlesNew[this.providerRole];
    this.addNavPath();

    if (this.editMode) {
      this.setEditMode();
    }
  }

  public setEditMode(): void {
    const editObservables: Observable<Employee | TruncatedItem[]>[] = [this.employee$.pipe(filter(Boolean))];

    if (!this.isDeputy) {
      editObservables.push(this.truncatedItems$.pipe(filter(Boolean)));
    }

    combineLatest(editObservables)
      .pipe(takeUntil(this.destroy$))
      .subscribe(([employee, allEntities]: [Employee, TruncatedItem[]]) => {
        this.EmployeeFormGroup.patchValue(employee, { emitEvent: false });
        if (allEntities) {
          this.entityControl.setValue(
            allEntities.filter((entity: TruncatedItem) =>
              employee.workshopTitles.find((checkedEntity: TruncatedItem) => entity.id === checkedEntity.id)
            )
          );
        }
      });

    this.store.dispatch(new GetEmployeeById(this.employeeId));
  }

  public addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const personalCabinetTitle = PersonalCabinetTitle[userRole];
    let navBarTitle: string;

    if (this.editMode) {
      navBarTitle = this.isDeputy ? NavBarName.UpdateProviderDeputy : NavBarName.UpdateEmployee;
    } else {
      navBarTitle = this.isDeputy ? NavBarName.CreateProviderDeputy : NavBarName.UpdateEmployee;
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
      confirmationType = this.isDeputy ? ModalConfirmationType.updateEmployeeDeputy : ModalConfirmationType.updateEmployee;
    } else {
      confirmationType = this.isDeputy ? ModalConfirmationType.createEmployeeDeputy : ModalConfirmationType.createEmployee;
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
        const employee = new Employee(this.EmployeeFormGroup.value, this.employeeId, this.managedWorkshopIds, this.provider.id);
        this.store.dispatch(this.editMode ? new UpdateEmployee(this.provider.id, employee) : new CreateEmployee(employee));
      });
  }

  public onCancel(): void {
    this.router.navigate(['/personal-cabinet/provider/administration']);
  }

  /**
   * This method makes EmployeeFormGroup dirty
   */
  public markFormAsDirtyOnUserInteraction(): void {
    if (!this.EmployeeFormGroup.dirty) {
      this.EmployeeFormGroup.markAsDirty({ onlySelf: true });
    }
  }
}
