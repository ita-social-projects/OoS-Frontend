import { Component, Input, OnInit } from '@angular/core';

import { Address } from 'shared/models/address.model';

@Component({
  selector: 'app-contacts-card',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsCardComponent implements OnInit {
  public contactsDataMock = {
    phoneList: [
      { type: 'home', phone: '6666666666' },
      { type: 'work', phone: '3333333333' }
    ],
    emailList: [
      { type: 'manager', email: 'some@gmial.com' },
      { type: 'employee', email: 'any@gmail.com' }
    ],
    facebook: 'string',
    instagram: 'string',
    website: 'string'
  };
  @Input() public address: Address;
  @Input() public contactsData: {
    phone: string;
    email: string;
    facebook: string;
    instagram: string;
    website: string;
  };

  private addressLink = 'https://www.google.com/maps/place/';

  public get getFullAddress(): string {
    return `${this.address.codeficatorAddressDto.settlement}, ${this.address.street}, ${this.address.buildingNumber}`;
  }

  public ngOnInit(): void {}

  /* Detects device and opens map*/
  public mapLink(): void {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      this.addressLink = 'https://maps.apple.com:';
      window.open(
        `${this.addressLink} ${this.address.street},+ ${this.address.buildingNumber} ,+ ${this.address.codeficatorAddressDto.fullAddress}`
      );
    } else if (/Android/i.test(navigator.userAgent)) {
      window.open(
        `${this.addressLink} ${this.address.street},+ ${this.address.buildingNumber} ,+ ${this.address.codeficatorAddressDto.fullAddress}`
      );
    } else {
      window.open(
        `${this.addressLink} ${this.address.street},+ ${this.address.buildingNumber} ,+ ${this.address.codeficatorAddressDto.fullAddress}`,
        '_blank'
      );
    }
  }
}
