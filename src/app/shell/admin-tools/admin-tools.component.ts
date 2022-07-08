import { AdminTabs } from './../../shared/enum/enumUA/tech-admin/admin-tabs';
import { Component } from '@angular/core';
@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.scss']
})
export class AdminToolsComponent{
  readonly admintabs = AdminTabs;
  constructor() { }
}
