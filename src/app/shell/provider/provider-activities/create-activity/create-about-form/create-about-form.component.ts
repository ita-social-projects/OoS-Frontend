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
  photos: File[] = [];
  AboutFormGroup: FormGroup;
  PhotoFormArray: FormArray;
  @Output() PassAboutFormGroup = new EventEmitter();
  @ViewChild('maxAgeInput') maxAgeInput: ElementRef<HTMLInputElement>;
  @ViewChild('minAgeInput') minAgeInput: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder) {
    this.AboutFormGroup = this.formBuilder.group({
      type: new FormControl(''),
      title: new FormControl('', Validators.required),
      img: new FormControl(''),
      phone: new FormControl('', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      ageFrom: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      ageTo: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      classAmount: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      price: new FormControl({ value: 0, disabled: true }),
      priceType: new FormControl(''),
    });

    this.onRadioButtonInit();
  }

  ngOnInit(): void {
    this.PassAboutFormGroup.emit(this.AboutFormGroup);
  }
  onUploadLogo(event): void {
    return null;
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
