import { Component, Inject, Input, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { WINDOW } from 'ngx-window-token';

import { Address } from 'shared/models/address.model';
import { MAP_URL } from 'shared/constants/constants';
import { Contacts, Workshop } from 'shared/models/workshop.model';
import { Provider } from 'shared/models/provider.model';

@Component({
  selector: 'app-contacts-card',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsCardComponent implements OnInit {
  @Input() public workshop: Workshop;
  @Input() public provider: Provider;

  public contacts: Contacts[];
  public panelOpenState = false;

  constructor(
    @Inject(WINDOW) private window: Window,
    private platform: Platform
  ) {}

  public getFullAddress(address: Address): string {
    if (!address) {
      return '';
    }
    const { street, buildingNumber, codeficatorAddressDto } = address;
    const settlement = codeficatorAddressDto?.settlement ?? '';
    return `${settlement}, ${street ?? ''}, ${buildingNumber ?? ''}`.trim();
  }

  public ngOnInit(): void {
    this.getContactsData();
  }

  public getContactsData(): void {
    this.contacts = this.workshop.contacts ?? [];
  }

  public mapLink(address: Address): void {
    const { street, buildingNumber, codeficatorAddressDto } = address;
    const fullAddress = codeficatorAddressDto?.fullAddress ?? '';
    const formattedAddress = [street, buildingNumber, fullAddress].filter((part) => part).join(', ');
    let addressLink = MAP_URL.GOOGLE;
    if (this.platform.IOS) {
      addressLink = MAP_URL.APPLE;
    } else if (this.platform.ANDROID) {
      addressLink = MAP_URL.GEO;
    }

    this.window.open(`${addressLink}${encodeURIComponent(formattedAddress)}`, '_blank');
  }
}
