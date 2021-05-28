import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';
import { SelectedWorkingHours } from 'src/app/shared/models/workingHours.model';
@Component({
  selector: 'app-create-about-form',
  templateUrl: './create-about-form.component.html',
  styleUrls: ['./create-about-form.component.scss']
})
export class CreateAboutFormComponent implements OnInit {

  readonly constants: typeof Constants = Constants;
  workingHours: SelectedWorkingHours[] = [];

  radioBtn = new FormControl(false);
  priceCtrl = new FormControl({ value: this.constants.MIN_PRICE, disabled: true });

  AboutFormGroup: FormGroup;
  @Output() PassAboutFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.AboutFormGroup = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      type: new FormControl(''),
      phone: new FormControl('', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      minAge: new FormControl('', [Validators.required]),
      maxAge: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      website: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      daysPerWeek: new FormControl(''),
      price: new FormControl(0),
      priceType: new FormControl(''),
      workingHours: new FormControl(''),
    });
    this.onPriceCtrlInit();
  }

  ngOnInit(): void {
    this.PassAboutFormGroup.emit(this.AboutFormGroup);

    this.addWorkHour();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to teh formgroup
   */
  onPriceCtrlInit(): void {
    this.priceCtrl.valueChanges.subscribe(val =>
      val ? this.AboutFormGroup.get('price').setValue(val) : this.AboutFormGroup.get('price').setValue(0))
    this.radioBtn.valueChanges.subscribe(val => {
      val ? this.priceCtrl.enable() : this.priceCtrl.disable();
    });
  }

  /**
  * This method add new working hours form to the array of working hours
  */
  addWorkHour(): void {
    const workHour: SelectedWorkingHours = {
      day: [],
      timeFrom: '',
      timeTo: ''
    }
    this.workingHours.push(workHour);
    this.AboutFormGroup.get('workingHours').setValue(this.workingHours);
  }

  /**
  * This method delete selected working hours form to the array of working hours
  */
  deleteWorkHour(workHour: SelectedWorkingHours): void {
    this.workingHours.splice(this.workingHours.indexOf(workHour), 1);
    this.AboutFormGroup.get('workingHours').setValue(this.workingHours);
  }
}
