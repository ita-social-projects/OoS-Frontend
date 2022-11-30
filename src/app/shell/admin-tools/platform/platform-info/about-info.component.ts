import { Select } from '@ngxs/store';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInformation } from '../../../../shared/models/сompanyInformation.model';
import { AdminTabsTitle } from '../../../../shared/enum/enumUA/tech-admin/admin-tabs';
import { AdminState } from '../../../../shared/store/admin.state';
@Component({
  selector: 'app-about-info',
  template: '<app-info-card [type]="aboutPortal" [platformInfo]="AboutPortal$ | async"></app-info-card>'
})
export class AboutInfoComponent {
  readonly aboutPortal = AdminTabsTitle.AboutPortal;

  @Select(AdminState.AboutPortal)
  AboutPortal$: Observable<CompanyInformation>;

  constructor() {}
}
