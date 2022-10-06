import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { AdminTabsTitle } from '../../../../shared/enum/enumUA/tech-admin/admin-tabs';
import { CompanyInformation } from '../../../../shared/models/сompanyInformation.model';
import { AdminState } from '../../../../shared/store/admin.state';

@Component({
  selector: 'app-regulations-info',
  template: '<app-info-card [type]="lawsAndRegulations" [platformInfo]="LawsAndRegulations$ | async"></app-info-card>',
})
export class RegulationsInfoComponent {
  readonly lawsAndRegulations = AdminTabsTitle.LawsAndRegulations;

  @Select(AdminState.LawsAndRegulations)
    LawsAndRegulations$: Observable<CompanyInformation>;
  @Select(AdminState.isLoading)
    isLoading$: Observable<boolean>;

  constructor() {}

}
