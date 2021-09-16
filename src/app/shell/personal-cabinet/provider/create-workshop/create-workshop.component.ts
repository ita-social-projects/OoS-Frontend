import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Address } from 'src/app/shared/models/address.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { UserWorkshopService } from 'src/app/shared/services/workshops/user-workshop/user-workshop.service';
import { MarkFormDirty } from 'src/app/shared/store/app.actions';
import { AppState } from 'src/app/shared/store/app.state';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateWorkshop, UpdateWorkshop } from 'src/app/shared/store/user.actions';
@Component({
  selector: 'app-create-workshop',
  templateUrl: './create-workshop.component.html',
  styleUrls: ['./create-workshop.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})
export class CreateWorkshopComponent implements OnInit {

  @Select(AppState.isDirtyForm)
  isDirtyForm$: Observable<Boolean>;
  isPristine = true;

  AboutFormGroup: FormGroup;
  DescriptionFormGroup: FormGroup;
  AddressFormGroup: FormGroup;
  TeacherFormArray: FormArray;

  editMode: boolean = false;
  workshop: Workshop;
  isLinear: boolean = false;


  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private userWorkshopService: UserWorkshopService) { }

  ngOnInit() {
    const workshopId = +this.route.snapshot.paramMap.get('id');
    if (workshopId) {
      this.editMode = true;
      this.userWorkshopService.getWorkshopById(workshopId).subscribe((workshop: Workshop) => this.workshop = workshop);
    }
  }

  /**
   * This method dispatch store action to create a Workshop with Form Groups values
   */
  onSubmit() {
    const address: Address = new Address(this.AddressFormGroup.value);
    const teachers: Teacher[] = this.createTeachers(this.TeacherFormArray);
    const provider: Provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);

    const aboutInfo = this.AboutFormGroup.getRawValue();
    const descInfo = this.DescriptionFormGroup.getRawValue();

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
   * This method receives a from from create-address child component and assigns to the Address FormGroup
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
   * This method receives  a from from create-about child component and assigns to the About FormGroup
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
  private createTeachers(formArray: FormArray): Teacher[] {
    const teachers: Teacher[] = [];
    formArray.controls.forEach((form: FormGroup) => {
      let teacher: Teacher = new Teacher(form.value);
      teachers.push(teacher);
    })
    return teachers;
  }

  private subscribeOnDirtyForm(form: FormGroup | FormArray): void {

    form.valueChanges
      .pipe(
        takeWhile(() => this.isPristine))
      .subscribe((value) => {
        console.log(form)
        console.log(value)
        debugger;

        this.isPristine = false;
        this.store.dispatch(new MarkFormDirty(true))
      });
  }
}
