import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss','./../../../validation.component.scss']
})
export class CreateAddressComponent implements OnInit {

  AddressFormGroup: FormGroup;

  @Output() passAddressFormGroup = new EventEmitter();


  constructor(
    private formBuilder: FormBuilder
    ){
    
    this.AddressFormGroup = this.formBuilder.group({
    street: new FormControl(''), 
    buildingNumber: new FormControl(''),
    city: new FormControl()
    });
  }

  ngOnInit(): void {
    this.passAddressFormGroup.emit(this.AddressFormGroup);
  }

}
