import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AdminTabTypes } from '../../../../shared/enum/admins';
import { CompanyInformation } from '../../../../shared/models/сompanyInformation.model';
import { AdminState } from '../../../../shared/store/admin.state';

@Component({
  selector: 'app-main-info',
  template: '<app-info-card [type]="mainInformation" [platformInfo]="MainInformation$ | async"></app-info-card>'
})
export class MainInfoComponent {
  readonly mainInformation = AdminTabTypes.MainPage;

  @Select(AdminState.MainInformation)
  MainInformation$: Observable<CompanyInformation>;
}
