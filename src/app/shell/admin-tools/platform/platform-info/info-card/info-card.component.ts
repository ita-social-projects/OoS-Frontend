import { AdminTabs } from 'src/app/shared/enum/enumUA/tech-admin/admin-tabs';
import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { AdminState } from 'src/app/shared/store/admin.state';

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
