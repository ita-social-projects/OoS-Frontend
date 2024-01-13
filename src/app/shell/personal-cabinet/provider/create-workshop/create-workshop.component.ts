import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { Role, Subrole } from 'shared/enum/role';
import { Address } from 'shared/models/address.model';
import { Provider } from 'shared/models/provider.model';
import { Teacher } from 'shared/models/teacher.model';
import { Workshop } from 'shared/models/workshop.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import { CreateWorkshop, UpdateWorkshop } from 'shared/store/provider.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { GetWorkshopById, ResetProviderWorkshopDetails } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { Util } from 'shared/utils/utils';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

@Component({
  selector: 'app-create-workshop',
  templateUrl: './create-workshop.component.html',
  styleUrls: ['./create-workshop.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class CreateWorkshopComponent extends CreateFormComponent implements OnInit, AfterContentChecked, OnDestroy {
  @Select(RegistrationState.provider)
  private provider$: Observable<Provider>;
  public provider: Provider;

  @Select(SharedUserState.selectedWorkshop)
  private selectedWorkshop$: Observable<Workshop>;
  public workshop: Workshop;

  public AboutFormGroup: FormGroup;
  public DescriptionFormGroup: FormGroup;
  public AddressFormGroup: FormGroup;
  public TeacherFormArray: FormArray;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {
    super(store, route, navigationBarService);
  }

  public ngOnInit(): void {
    this.provider$
      .pipe(
        takeUntil(this.destroy$),
        filter((provider: Provider) => !!provider)
      )
      .subscribe((provider: Provider) => (this.provider = provider));

    this.determineEditMode();
    this.determineRelease();
    this.addNavPath();
  }

  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  public addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const subrole = this.store.selectSnapshot<Subrole>(RegistrationState.subrole);
    const personalCabinetTitle = Util.getPersonalCabinetTitle(userRole, subrole);
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
            name: this.editMode ? NavBarName.EditWorkshop : NavBarName.NewWorkshop,
            isActive: false,
            disable: true
          }
        )
      )
    );
  }

  public setEditMode(): void {
    const workshopId = this.route.snapshot.paramMap.get('param');
    this.store.dispatch(new GetWorkshopById(workshopId));

    this.selectedWorkshop$
      .pipe(
        takeUntil(this.destroy$),
        filter((workshop: Workshop) => workshop?.id === workshopId)
      )
      .subscribe((workshop: Workshop) => (this.workshop = workshop));
  }

  /**
   * This method dispatch store action to create a Workshop with Form Groups values
   */
  public onSubmit(): void {
    const provider: Provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    const address: Address = new Address(this.AddressFormGroup.value, this.workshop?.address);
    const aboutInfo = this.AboutFormGroup.getRawValue();
    const descInfo = this.DescriptionFormGroup.getRawValue();
    const teachers = this.createTeachers();

    let workshop: Workshop;

    if (this.editMode) {
      workshop = new Workshop(aboutInfo, descInfo, address, teachers, provider, this.workshop.id);
      this.store.dispatch(new UpdateWorkshop(workshop));
    } else {
      workshop = new Workshop(aboutInfo, descInfo, address, teachers, provider);
      this.store.dispatch(new CreateWorkshop(workshop));
    }
  }

  /**
   * This method receives a form from create-address child component and assigns to the Address FormGroup
   * @param FormGroup form
   */
  public onReceiveAddressFormGroup(form: FormGroup): void {
    this.AddressFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * This method receives an array of forms from create-teachers child component and assigns to the Teacher FormArray
   * @param FormArray array
   */
  public onReceiveTeacherFormArray(array: FormArray): void {
    this.TeacherFormArray = array;
    this.subscribeOnDirtyForm(array);
  }

  /**
   * This method receives a form from create-about child component and assigns to the About FormGroup
   * @param FormGroup form
   */
  public onReceiveAboutFormGroup(form: FormGroup): void {
    this.AboutFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * This method receives a from create-description child component and assigns to the Description FormGroup
   * @param FormGroup form
   */
  public onReceiveDescriptionFormGroup(form: FormGroup): void {
    this.DescriptionFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  public onCancel(): void {
    this.router.navigate(['/personal-cabinet/provider/workshops']);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(new ResetProviderWorkshopDetails());
  }

  /**
   * This method create array of teachers
   * @param FormArray formArray
   */
  private createTeachers(): Teacher[] {
    const teachers: Teacher[] = [];
    if (this.TeacherFormArray?.controls) {
      this.TeacherFormArray.controls.forEach((form: FormGroup) => {
        const teacher: Teacher = new Teacher(form.value);
        teachers.push(teacher);
      });
    }
    return teachers;
  }
}
