import { Component, Input, OnInit } from '@angular/core';
import { Competition } from 'shared/models/competition.model';
import { Role } from '../../../shared/enum/role';
import { Address } from '../../../shared/models/address.model';
import { Provider } from '../../../shared/models/provider.model';
import { Workshop } from '../../../shared/models/workshop.model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html'
})
export class SideMenuComponent implements OnInit {
  @Input() public provider: Provider;
  @Input() public workshop: Workshop;
  @Input() public competition: Competition;
  @Input() public role: string;
  @Input() public isMobileScreen: boolean;
  @Input() public displayActionCard: boolean;

  public readonly Role: typeof Role = Role;

  public address: Address;
  public contactsData: {
    phone: string;
    email: string;
    facebook: string;
    instagram: string;
    website: string;
  };

  constructor() {}

  public ngOnInit(): void {
    this.getContactsData();
  }

  private getContactsData(): void {
    this.contactsData = {
      phone: this.workshop?.contacts?.[0]?.phones?.[0]?.number ?? this.provider.phoneNumber,
      email: this.workshop?.contacts?.[0]?.emails?.[0]?.address ?? this.provider.email,
      facebook: this.workshop?.contacts?.[0]?.socialNetworks?.[0]?.url ?? this.provider.facebook,
      instagram: this.workshop?.contacts?.[0]?.socialNetworks?.[1]?.url ?? this.provider.instagram,
      website: this.workshop?.contacts?.[0]?.socialNetworks?.[2]?.url ?? this.provider.website
    };
    this.address = { ...(this.workshop?.contacts?.[0]?.address ?? this.provider?.actualAddress ?? this.provider.legalAddress) };
  }
}
