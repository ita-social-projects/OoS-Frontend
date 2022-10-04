import { Select } from '@ngxs/store';
import { Component} from '@angular/core';
import { Observable } from 'rxjs';
import { AdminTabsTitle } from '../../../../shared/enum/enumUA/tech-admin/admin-tabs';
import { CompanyInformation } from '../../../../shared/models/сompanyInformation.model';
import { AdminState } from '../../../../shared/store/admin.state';

@Component({
  selector: 'app-support-info',
  template: '<app-info-card [type]="supportInformation" [platformInfo]="SupportInformation$ | async"></app-info-card>',
})
export class SupportInfoComponent {
  readonly supportInformation = AdminTabsTitle.SupportInformation;

  @Select(AdminState.SupportInformation)
  SupportInformation$: Observable<CompanyInformation>;

  constructor() { }
}
