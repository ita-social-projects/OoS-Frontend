import { Component, Input, OnInit } from '@angular/core';
import { Constants } from '../../../../shared/constants/constants';
import { Address } from '../../../../shared/models/address.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  readonly phonePrefix = Constants.PHONE_PREFIX;

  @Input() address: Address;
  @Input() contactsData: {
    phone: string;
    email: string;
    facebook: string;
    instagram: string;
    website: string;
  };

  addressLink = 'https://www.google.com/maps/place/';

  constructor() { }

  ngOnInit(): void { }

  /*Detects device and opens map*/
  mapLink(): void {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      this.addressLink = 'http://maps.apple.com:';
      window.open(`${this.addressLink} ${this.address.street},+ ${this.address.buildingNumber} ,+ ${this.address.codeficatorAddressDto.fullAddress}`);
    } else if (/Android/i.test(navigator.userAgent)) {
      window.open(`${this.addressLink} ${this.address.street},+ ${this.address.buildingNumber} ,+ ${this.address.codeficatorAddressDto.fullAddress}`);
    } else {
      window.open(`${this.addressLink} ${this.address.street},+ ${this.address.buildingNumber} ,+ ${this.address.codeficatorAddressDto.fullAddress}`, '_blank');
    }
  }
}
