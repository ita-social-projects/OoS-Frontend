import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Address } from 'src/app/shared/models/address.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { UserWorkshopService } from 'src/app/shared/services/workshops/user-workshop/user-workshop.service';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateWorkshop, UpdateWorkshop } from 'src/app/shared/store/user.actions';
@Component({
  selector: 'app-create-workshop',
  templateUrl: './create-workshop.component.html',
  styleUrls: ['./create-workshop.component.scss']
})
export class CreateWorkshopComponent implements OnInit {

  AboutFormGroup: FormGroup;
  DescriptionFormGroup: FormGroup;
  AddressFormGroup: FormGroup;
  TeacherFormArray: FormArray;

  editMode: boolean = false;
  workshop: Workshop;


  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private userWorkshopService: UserWorkshopService) { }

  ngOnInit() {
    const workshopId = +this.route.snapshot.paramMap.get('id');
    if (workshopId) {
      this.editMode = true;
      this.userWorkshopService.getWorkshopsById(workshopId).subscribe(workshop => this.workshop = workshop);
    }
  }

  /**
   * This method dispatch store action to create a Workshop with Form Groups values
   */
  onSubmit() {
    const address = new Address(this.AddressFormGroup.value);
    const teachers = this.createTeachers(this.TeacherFormArray);
    const provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    if (this.editMode) {
      const workshop = new Workshop(this.AboutFormGroup.value, this.DescriptionFormGroup.value, address, teachers, provider, this.workshop.id);
      this.store.dispatch(new UpdateWorkshop(workshop));
    } else {
      const workshop = new Workshop(this.AboutFormGroup.value, this.DescriptionFormGroup.value, address, teachers, provider);
      this.store.dispatch(new CreateWorkshop(workshop));
    }
  }

  /**
   * This method receives a from from create-address child component and assigns to the Address FormGroup
   * @param FormGroup form
   */
  onReceiveAddressFormGroup(form: FormGroup): void {
    this.AddressFormGroup = form;
  }

  /**
   * This method receives an array of forms from create-teachers child component and assigns to the Teacher FormArray
   * @param FormArray array
   */
  onReceiveTeacherFormArray(array: FormArray): void {
    this.TeacherFormArray = array;
  }

  /**
   * This method receives  a from from create-about child component and assigns to the About FormGroup
   * @param FormGroup form
   */
  onReceiveAboutFormGroup(form: FormGroup): void {
    this.AboutFormGroup = form;
  }

  /**
   * This method receives a from create-description child component and assigns to the Description FormGroup
   * @param FormGroup form
   */
  onReceiveDescriptionFormGroup(form: FormGroup): void {
    this.DescriptionFormGroup = form;
  }

  /**
   * This method create array of teachers
   * @param FormArray formArray
   */
  createTeachers(formArray: FormArray): Teacher[] {
    const teachers: Teacher[] = [];
    formArray.controls.forEach((form: FormGroup) => {
      let teacher: Teacher = new Teacher(form.value);
      teachers.push(teacher);
    })
    return teachers;
  }
}
