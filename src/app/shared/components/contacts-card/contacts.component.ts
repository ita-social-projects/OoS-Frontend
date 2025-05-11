import { Component, Inject, Input, OnInit } from '@angular/core';
import { Address } from 'shared/models/address.model';
import { Store } from '@ngxs/store';
import { Contact } from 'shared/models/contact.model';
import { WINDOW } from 'ngx-window-token';
import { Platform } from '@angular/cdk/platform';
import { MAP_URL } from 'shared/constants/constants';
import { Competition } from 'shared/models/competition.model';
import { ActivatedRoute } from '@angular/router';
import { Workshop } from 'shared/models/workshop.model';
import { Provider } from 'shared/models/provider.model';

@Component({
  selector: 'app-contacts-card',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsCardComponent implements OnInit {
  @Input() public workshop: Workshop;
  @Input() public provider: Provider;
  @Input() public competition: Competition;

  public contacts: Contact[] = [];
  public panelOpenState = false;
  constructor(
    @Inject(WINDOW) private window: Window,
    private store: Store,
    private platform: Platform,
    private route: ActivatedRoute
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
    const entity = this.route.snapshot.paramMap.get('entity');
    const isInfoPath = this.route.snapshot.routeConfig?.path === 'info';
    if (isInfoPath && this.provider?.contacts) {
      this.contacts = this.provider?.contacts as unknown as Contact[];
    } else {
      const entityMap = {
        workshop: 'selectedWorkshop',
        competition: 'selectedCompetition',
        provider: 'selectedProvider'
      };
      if (entity && entityMap[entity]) {
        this.contacts = this.store.selectSnapshot((store) => store.user[entityMap[entity]]?.contacts);
      } else {
        console.warn(`Unknown entity type: ${entity}`);
      }
    }
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
