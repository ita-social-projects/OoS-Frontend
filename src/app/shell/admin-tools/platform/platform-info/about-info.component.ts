import { Select } from '@ngxs/store';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInformation } from '../../../../shared/models/сompanyInformation.model';
import { AdminState } from '../../../../shared/store/admin.state';
import { AdminTabTypes } from '../../../../shared/enum/admins';
@Component({
  selector: 'app-about-info',
  template: '<app-info-card [type]="aboutPortal" [platformInfo]="AboutPortal$ | async"></app-info-card>'
})
export class AboutInfoComponent {
  readonly aboutPortal = AdminTabTypes.AboutPortal;

  @Select(AdminState.AboutPortal)
  AboutPortal$: Observable<CompanyInformation>;
}
