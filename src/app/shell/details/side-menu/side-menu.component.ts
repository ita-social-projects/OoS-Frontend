import { Component, Input, OnInit } from '@angular/core';
import { Competition } from 'shared/models/competition.model';
import { Role } from 'shared/enum/role';
import { Address } from 'shared/models/address.model';
import { Provider } from 'shared/models/provider.model';
import { Socials, Workshop, WorkshopDraft } from 'shared/models/workshop.model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Input() public provider: Provider;
  @Input() public workshop: Workshop | WorkshopDraft;
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
}
