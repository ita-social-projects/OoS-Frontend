import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AdminTabTypes } from 'shared/enum/admins';
import { CompanyInformation } from 'shared/models/company-information.model';
import { AdminState } from 'shared/store/admin.state';

@Component({
  selector: 'app-main-info',
  template: '<app-info-card [type]="AdminTabTypes.MainPage" [platformInfo]="mainInformation$ | async"></app-info-card>'
})
export class MainInfoComponent {
  @Select(AdminState.mainInformation)
  public mainInformation$: Observable<CompanyInformation>;

  public readonly AdminTabTypes = AdminTabTypes;
}
