import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Address } from 'src/app/shared/models/address.model';
import { City } from 'src/app/shared/models/city.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss']
})
export class CreateAddressComponent implements OnInit {

  @Input() address: Address;
  @Output() passAddressFormGroup = new EventEmitter();

  AddressFormGroup: FormGroup;
  cityValue: FormControl;
  city: string;

  @Select(MetaDataState.cities)
  cities$: Observable<City[]>;

  constructor(
    private formBuilder: FormBuilder) {
    this.AddressFormGroup = this.formBuilder.group({
      street: new FormControl('', Validators.required),
      buildingNumber: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.passAddressFormGroup.emit(this.AddressFormGroup);
    this.city = this.address.city;
    this.address && this.AddressFormGroup.patchValue(this.address, { emitEvent: false });
  }

  onSelectedCity(event: any): void {
    this.AddressFormGroup.get('city').setValue(event.name)
  }
  
  onReceiveAddressFromMap(address: Address): void {
    this.city = address.city;
    this.AddressFormGroup.patchValue(address)
  }
}
