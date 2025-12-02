import { Component, Inject, Input, OnInit } from '@angular/core';
import { Address } from 'shared/models/address.model';
import { Contact } from 'shared/models/contact.model';
import { WINDOW } from 'ngx-window-token';
import { Platform } from '@angular/cdk/platform';
import { MAP_URL } from 'shared/constants/constants';
import { Competition } from 'shared/models/competition.model';
import { Workshop, WorkshopDraft } from 'shared/models/workshop.model';
import { Provider } from 'shared/models/provider.model';

@Component({
  selector: 'app-contacts-card',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsCardComponent {
  public contacts: Contact[] = [];

  constructor(
    @Inject(WINDOW) private readonly window: Window,
    private readonly platform: Platform
  ) {}

  @Input()
  public set entity(value: Workshop | WorkshopDraft | Provider | Competition) {
    this.contacts = (value?.contacts as Contact[]) ?? [];
  }

  public getFullAddress(address: Address): string {
    if (!address) {
      return '';
    }
    const { street, buildingNumber, codeficatorAddress } = address;
    const settlement = codeficatorAddress?.settlement ?? '';
    return `${settlement}, ${street ?? ''}, ${buildingNumber ?? ''}`.trim();
  }

  public mapLink(address: Address): void {
    const { street, buildingNumber, codeficatorAddress } = address;
    const fullAddress = codeficatorAddress?.fullAddress ?? '';
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
