import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AdminTabTypes } from 'shared/enum/admins';
import { CompanyInformation } from 'shared/models/company-information.model';
import { AdminState } from 'shared/store/admin.state';

@Component({
  selector: 'app-support-info',
  template: '<app-info-card [type]="supportInformation" [platformInfo]="SupportInformation$ | async"></app-info-card>'
})
export class SupportInfoComponent {
  readonly supportInformation = AdminTabTypes.SupportInformation;

  @Select(AdminState.SupportInformation)
  SupportInformation$: Observable<CompanyInformation>;
}
