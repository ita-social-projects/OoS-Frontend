import { Component, Input, OnInit } from '@angular/core';

import { Address } from 'shared/models/address.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  @Input() public address: Address;
  @Input() public contactsData: {
    phone: string;
    email: string;
    facebook: string;
    instagram: string;
    website: string;
  };

  public get getFullAddress(): string {
    return `${this.address.codeficatorAddressDto.settlement}, ${this.address.street}, ${this.address.buildingNumber}`;
  }

  private addressLink = 'https://www.google.com/maps/place/';

  constructor() {}

  public ngOnInit(): void {}

  /*Detects device and opens map*/
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
