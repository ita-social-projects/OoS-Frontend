import { Component, Input, OnInit } from '@angular/core';
import { Role } from '../../../shared/enum/role';
import { Address } from '../../../shared/models/address.model';
import { Provider } from '../../../shared/models/provider.model';
import { Workshop } from '../../../shared/models/workshop.model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html'
})
export class SideMenuComponent implements OnInit {
  readonly Role: typeof Role = Role;

  @Input() provider: Provider;
  @Input() workshop: Workshop;
  @Input() role: string;
  @Input() isMobileScreen: boolean;
  @Input() displayActionCard: boolean;

  address: Address;
  contactsData: {
    phone: string;
    email: string;
    facebook: string;
    instagram: string;
    website: string;
  };

  constructor() {}

  ngOnInit(): void {
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
}
