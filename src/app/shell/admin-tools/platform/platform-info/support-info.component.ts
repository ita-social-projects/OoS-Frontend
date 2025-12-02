import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AdminTabTypes } from 'shared/enum/admins';
import { CompanyInformation } from 'shared/models/company-information.model';
import { AdminState } from 'shared/store/admin.state';

@Component({
  selector: 'app-support-info',
  template: '<app-info-card [type]="AdminTabTypes.SupportInformation" [platformInfo]="supportInformation$ | async"></app-info-card>'
})
export class SupportInfoComponent {
  @Select(AdminState.supportInformation)
  public supportInformation$: Observable<CompanyInformation>;

  public readonly AdminTabTypes = AdminTabTypes;
}
