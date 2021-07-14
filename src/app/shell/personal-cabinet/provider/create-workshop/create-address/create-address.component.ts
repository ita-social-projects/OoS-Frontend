import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from 'src/app/shared/models/address.model';

@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss']
})
export class CreateAddressComponent implements OnInit {

  @Input() address: Address;
  @Output() passAddressFormGroup = new EventEmitter();

  AddressFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder) {
    this.AddressFormGroup = this.formBuilder.group({
      street: new FormControl('', Validators.required),
      buildingNumber: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.passAddressFormGroup.emit(this.AddressFormGroup);
    this.address && this.AddressFormGroup.patchValue(this.address, { emitEvent: false });
  }

  onReceiveAddressFromMap(address: Address): void {
    this.AddressFormGroup.patchValue(address)
  }
}
