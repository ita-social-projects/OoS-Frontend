import { Component, Input, OnInit } from '@angular/core';
import { Address } from 'shared/models/address.model';
import { Workshop } from '../../../shared/models/workshop.model';
import { Provider } from '../../../shared/models/provider.model';

@Component({
  selector: 'app-contacts-card',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsCardComponent implements OnInit {
  @Input() public workshop: Workshop;
  @Input() public provider: Provider;

  public mockData = [
    {
      addressType: 'Home',
      address: 'м.Київ вул.Юного Професора Астрофізики та Соціальної політики по вивченню пінгвінів 2',
      contacts: [
        {
          type: 'Директор',
          phoneList: ['6666666666', '3333333333'],
          emailList: ['some@gmial.com', 'any@gmail.com'],
          facebook: 'string',
          instagram: 'string',
          website: 'string'
        },
        {
          type: 'Вчитель Петро',
          phoneList: ['6666666666'],
          emailList: ['manager@gff.com', 'some@gmial.com'],
          facebook: 'string',
          instagram: 'string',
          website: 'www.cookies.com'
        },
        {
          type: 'Вчителька Оля',
          phoneList: ['6666666666', '3333333333'],
          emailList: ['some@gmial.com'],
          facebook: 'string',
          instagram: 'string',
          website: 'string'
        }
      ]
    },
    {
      addressType: 'Work',
      address: 'м.Київ вул.Шевченка 2',
      contacts: [
        {
          type: 'Директор',
          phoneList: ['6666666666', '3333333333'],
          emailList: ['some@gmial.com', 'any@gmail.com'],
          facebook: 'string',
          instagram: 'string',
          website: 'string'
        },
        {
          type: 'Вчитель Петро',
          phoneList: ['6666666666'],
          emailList: ['manager', 'some@gmial.com'],
          facebook: 'string',
          instagram: 'string',
          website: 'string'
        },
        {
          type: 'Вчителька Оля',
          phoneList: ['6666666666', '3333333333'],
          emailList: ['some@gmial.com'],
          facebook: 'string',
          instagram: 'string',
          website: 'string'
        }
      ]
    }
  ];

  panelOpenState = false;
  public address: Address;
  public contactsData: {
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

  public ngOnInit(): void {
    this.getContactsData();
  }
  private getContactsData(): void {
    this.contactsData = {
      phone: this.workshop?.phone || this.provider.phoneNumber,
      email: this.workshop?.email || this.provider.email,
      facebook: this.workshop?.facebook || this.provider.facebook,
      instagram: this.workshop?.instagram || this.provider.instagram,
      website: this.workshop?.website || this.provider.website
    };
    this.address = { ...(this.workshop?.address || this.provider?.actualAddress || this.provider.legalAddress) };
  }
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
