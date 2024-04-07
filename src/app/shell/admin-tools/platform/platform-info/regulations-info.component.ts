import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AdminTabTypes } from 'shared/enum/admins';
import { CompanyInformation } from 'shared/models/company-information.model';
import { AdminState } from 'shared/store/admin.state';

@Component({
  selector: 'app-regulations-info',
  template: '<app-info-card [type]="AdminTabTypes.LawsAndRegulations" [platformInfo]="lawsAndRegulations$ | async"></app-info-card>'
})
export class RegulationsInfoComponent {
  @Select(AdminState.isLoading)
  public isLoading$: Observable<boolean>;
  @Select(AdminState.lawsAndRegulations)
  public lawsAndRegulations$: Observable<CompanyInformation>;

  public readonly AdminTabTypes = AdminTabTypes;
}
