import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AdminTabsTitle } from '../../../../shared/enum/enumUA/tech-admin/admin-tabs';
import { CompanyInformation } from '../../../../shared/models/сompanyInformation.model';
import { AdminState } from '../../../../shared/store/admin.state';

@Component({
  selector: 'app-main-info',
  template: '<app-info-card [type]="mainInformation" [platformInfo]="MainInformation$ | async"></app-info-card>'
})
export class MainInfoComponent {
  readonly mainInformation = AdminTabsTitle.MainPage;

  @Select(AdminState.MainInformation)
  MainInformation$: Observable<CompanyInformation>;

  constructor() {}
}
