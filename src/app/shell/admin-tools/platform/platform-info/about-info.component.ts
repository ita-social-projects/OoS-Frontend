import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AdminTabTypes } from 'shared/enum/admins';
import { CompanyInformation } from 'shared/models/company-information.model';
import { AdminState } from 'shared/store/admin.state';

@Component({
  selector: 'app-about-info',
  template: '<app-info-card [type]="AdminTabTypes.AboutPortal" [platformInfo]="aboutPortal$ | async"></app-info-card>'
})
export class AboutInfoComponent {
  @Select(AdminState.aboutPortal)
  public aboutPortal$: Observable<CompanyInformation>;

  public readonly AdminTabTypes = AdminTabTypes;
}
