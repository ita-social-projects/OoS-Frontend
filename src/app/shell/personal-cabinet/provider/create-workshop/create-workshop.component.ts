import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Address } from 'src/app/shared/models/address.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { UserWorkshopService } from 'src/app/shared/services/workshops/user-workshop/user-workshop.service';
import { AddNavPath } from 'src/app/shared/store/navigation.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateWorkshop, UpdateWorkshop } from 'src/app/shared/store/user.actions';
import { CreateFormComponent } from '../../create-form/create-form.component';

@Component({
  selector: 'app-create-workshop',
  templateUrl: './create-workshop.component.html',
  styleUrls: ['./create-workshop.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})
export class CreateWorkshopComponent extends CreateFormComponent implements OnInit, OnDestroy {
  workshop: Workshop;

  AboutFormGroup: FormGroup;
  DescriptionFormGroup: FormGroup;
  AddressFormGroup: FormGroup;
  TeacherFormArray: FormArray;

  constructor(
    private userWorkshopService: UserWorkshopService,
    store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService) {
    super(store, route, navigationBarService);
  }

  ngOnInit(): void {
    this.determineEditMode();
    this.determineRelease();
    this.addNavPath();
  }

  addNavPath(): void {
    this.store.dispatch(new AddNavPath(this.navigationBarService.createNavPaths(
      { name: NavBarName.PersonalCabinetProvider, path: '/personal-cabinet/workshops', isActive: false, disable: false },
      { name: this.editMode ? NavBarName.EditWorkshop : NavBarName.NewWorkshop, isActive: false, disable: true })));
  }

  setEditMode(): void {
    const workshopId = this.route.snapshot.paramMap.get('param');
    this.userWorkshopService.getWorkshopById(workshopId).pipe(
      takeUntil(this.destroy$),
    ).subscribe((workshop: Workshop) => this.workshop = workshop);//TODO: move to state actions
  }


  /**
   * This method dispatch store action to create a Workshop with Form Groups values
   */
  onSubmit(): void {
    const provider: Provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    const address: Address = new Address(this.AddressFormGroup.value);
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
  onReceiveAddressFormGroup(form: FormGroup): void {
    this.AddressFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * This method receives an array of forms from create-teachers child component and assigns to the Teacher FormArray
   * @param FormArray array
   */
  onReceiveTeacherFormArray(array: FormArray): void {
    this.TeacherFormArray = array;
    this.subscribeOnDirtyForm(array);
  }

  /**
   * This method receives  a from form create-about child component and assigns to the About FormGroup
   * @param FormGroup form
   */
  onReceiveAboutFormGroup(form: FormGroup): void {
    this.AboutFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * This method receives a from create-description child component and assigns to the Description FormGroup
   * @param FormGroup form
   */
  onReceiveDescriptionFormGroup(form: FormGroup): void {
    this.DescriptionFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * This method create array of teachers
   * @param FormArray formArray
   */
  private createTeachers(): Teacher[] {
    const teachers: Teacher[] = [];
    if(this.TeacherFormArray?.controls) {
      this.TeacherFormArray.controls.forEach((form: FormGroup) => {
        const teacher: Teacher = new Teacher(form.value);
        teachers.push(teacher);
      });
    }
    return teachers;
  }


  /**
   * This method receives a form and marks each control of this form as touched
   * @param FormGroup form
   */
  checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach((key: string) => {
      form.get(key).markAsTouched();
    });
    if (form.get('categories')) {
      Object.keys((this.DescriptionFormGroup.get('categories') as FormGroup).controls).forEach((key: string) => {
        this.DescriptionFormGroup.get('categories').get(key).markAsTouched();
      });
    }
    if (form.get('workingHours')) {
      (this.AboutFormGroup.get('workingHours') as FormArray).controls.forEach((form: FormGroup) => {
        Object.keys(form.controls).forEach((key: string) => {
          form.get(key).markAsTouched();
        });
      })
    }
  }

  // /**
  //  * This method marks each control of form in the array of teachers' forms as touched
  //  */
  // private checkTeacherFormArrayValidation(): void {
  //   Object.keys(this.TeacherFormArray.controls).forEach(key => this.checkValidation(this.TeacherFormArray.get(key) as FormGroup));
  // }
}
