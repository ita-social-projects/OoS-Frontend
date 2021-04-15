import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Constants } from '../../../../../shared/constants/constants';

@Component({
  selector: 'app-create-about-form',
  templateUrl: './create-about-form.component.html',
  styleUrls: ['./create-about-form.component.scss','./../../../validation.component.scss']
})
export class CreateAboutFormComponent implements OnInit {

  radioBtn = new FormControl(false);
  priceCtrl = new FormControl({ value: 0, disable: true });
  AboutFormGroup: FormGroup;
  @Output() PassAboutFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.AboutFormGroup = this.formBuilder.group({
      type: new FormControl(''),
      title: new FormControl(''), 
      phone: new FormControl(''),
      email: new FormControl(''),
      ageFrom: new FormControl(''),
      ageTo: new FormControl(''),
      classAmount: new FormControl(''),
      price: new FormControl({ value: 0, disabled: true }),
      priceType: new FormControl(''),
    });
    
    this.onRadioButtonInit();
    this.onInputValidation();
   }

  ngOnInit(): void {
    this.PassAboutFormGroup.emit(this.AboutFormGroup);
  }
  onUploadLogo( event ):void {
    return null;
  }
  /**
   * This method sets validation for age and classAmount inputs and resets them if values are invalid
   */
  onInputValidation(): void {
    this.AboutFormGroup.get('ageFrom').valueChanges.subscribe(val=> {
      if(val){
        if ( val < Constants.AGE_MIN || val > Constants.AGE_MAX ) this.AboutFormGroup.get('ageFrom').reset(); 
      }
    });
    this.AboutFormGroup.get('ageTo').valueChanges.subscribe(val=> {
      if(val){
        if ( val < Constants.AGE_MAX|| val > Constants.AGE_MIN) this.AboutFormGroup.get('ageTo').reset(); 
      }
    });
    this.AboutFormGroup.get('classAmount').valueChanges.subscribe(val=> {
      if(val){
        if ( val < Constants.CLASS_AMOUNT_MIN || val > Constants.CLASS_AMOUNT_MAX ) this.AboutFormGroup.get('classAmount').reset(); 
      }
    });
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
