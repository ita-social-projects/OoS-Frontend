import { Component, Input } from '@angular/core';
import { Competition } from 'shared/models/competition.model';
import { Role } from 'shared/enum/role';
import { Workshop, WorkshopDraft } from 'shared/models/workshop.model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  @Input() public workshop: Workshop | WorkshopDraft;
  @Input() public competition: Competition;
  @Input() public isMobileScreen: boolean;
  @Input() public role: string;
  @Input() public displayActionCard: boolean;

  public readonly Role: typeof Role = Role;

  constructor() {}
}
