import { Component, Inject, Input, OnInit } from '@angular/core';
import { Address } from 'shared/models/address.model';
import { Store } from '@ngxs/store';
import { Contact } from 'shared/models/contacts.model';
import { WINDOW } from 'ngx-window-token';
import { Platform } from '@angular/cdk/platform';
import { MAP_LINKS } from 'shared/constants/constants';
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

  public contacts: Contact[] = [];
  public panelOpenState = false;
  constructor(
    @Inject(WINDOW) private window: Window,
    private store: Store,
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
    this.contacts = this.store.selectSnapshot((store) => store.user.selectedWorkshop?.contacts);
  }

  public mapLink(address: Address): void {
    const { street, buildingNumber, codeficatorAddressDto } = address;
    const fullAddress = codeficatorAddressDto?.fullAddress ?? '';
    const formattedAddress = [street, buildingNumber, fullAddress].filter((part) => part).join(', ');
    let addressLink = MAP_LINKS.mapLinkGoogleMaps;
    if (this.platform.IOS) {
      addressLink = MAP_LINKS.mapLinkIOS;
    } else if (this.platform.ANDROID) {
      addressLink = MAP_LINKS.mapLinkAndroid;
    }

    this.window.open(`${addressLink}${encodeURIComponent(formattedAddress)}`, '_blank');
  }
}
