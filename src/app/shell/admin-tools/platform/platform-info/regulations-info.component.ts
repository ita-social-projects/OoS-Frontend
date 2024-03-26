import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AdminTabTypes } from 'shared/enum/admins';
import { CompanyInformation } from 'shared/models/company-information.model';
import { AdminState } from 'shared/store/admin.state';

@Component({
  selector: 'app-regulations-info',
  template: '<app-info-card [type]="lawsAndRegulations" [platformInfo]="LawsAndRegulations$ | async"></app-info-card>'
})
export class RegulationsInfoComponent {
  readonly lawsAndRegulations = AdminTabTypes.LawsAndRegulations;

  @Select(AdminState.LawsAndRegulations)
  LawsAndRegulations$: Observable<CompanyInformation>;
  @Select(AdminState.isLoading)
  isLoading$: Observable<boolean>;
}
