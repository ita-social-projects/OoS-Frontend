import { Component, Input, OnInit } from '@angular/core';
import { Role } from '../../../shared/enum/role';
import { Workshop } from '../../../shared/models/workshop.model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Input() public workshop: Workshop;
  @Input() public role: string;
  @Input() public isMobileScreen: boolean;
  @Input() public displayActionCard: boolean;

  public readonly Role: typeof Role = Role;

  constructor() {}

  public ngOnInit(): void {}
}
