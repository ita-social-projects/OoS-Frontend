import { Select } from '@ngxs/store';
import { Component} from '@angular/core';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { AdminState } from 'src/app/shared/store/admin.state';
import { Observable } from 'rxjs';
import { AdminTabsTitle } from 'src/app/shared/enum/enumUA/tech-admin/admin-tabs';
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
