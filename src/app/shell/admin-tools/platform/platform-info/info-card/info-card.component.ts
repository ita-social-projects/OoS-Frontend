import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AdminTabs } from '../../../../../shared/enum/enumUA/tech-admin/admin-tabs';
import { CompanyInformation } from '../../../../../shared/models/сompanyInformation.model';
import { AdminState } from '../../../../../shared/store/admin.state';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() type: AdminTabs;
  @Input() platformInfo: CompanyInformation;

  @Select(AdminState.isLoading)
  isLoading$: Observable<boolean>;

  constructor() {
  }
}
