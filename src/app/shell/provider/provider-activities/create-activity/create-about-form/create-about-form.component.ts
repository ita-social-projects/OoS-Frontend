import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-about-form',
  templateUrl: './create-about-form.component.html',
  styleUrls: ['./create-about-form.component.scss', './../../../validation.component.scss']
})
export class CreateAboutFormComponent implements OnInit {

  radioBtn = new FormControl(false);
  priceCtrl = new FormControl({ value: 0, disable: true });
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
      price: new FormControl({ value: 0, disabled: true }),
      priceType: new FormControl(''),
    });

    this.onRadioButtonInit();
  }

  ngOnInit(): void {
    this.PassAboutFormGroup.emit(this.AboutFormGroup);
  }
  /**
   * This method makes input enable if radiobutton value is true
   */
  onRadioButtonInit(): void {
    this.radioBtn.valueChanges.subscribe(val =>
      val ? this.AboutFormGroup.get('price').enable() : this.AboutFormGroup.get('price').disable()
    );
  }
}
