import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Address } from 'src/app/shared/models/address.model';
import { ProviderActivitiesService } from 'src/app/shared/services/provider-activities/provider-activities.service';

@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss']
})
export class CreateAddressComponent implements OnInit {

  AddressFormGroup: FormGroup;
  address:Address

  constructor(private formBuilder: FormBuilder, private providerActivititesService: ProviderActivitiesService) {
    this.AddressFormGroup = this.formBuilder.group({
      city: new FormControl(''),
      street: new FormControl(''), 
      building: new FormControl('')
    });
   }

  ngOnInit(): void {
  }

  onSubmit() {
    const info = this.AddressFormGroup.value;
    this.address= new Address(info);
    console.log(this.address)

    this.providerActivititesService.createAddress(this.address);
  }
}
