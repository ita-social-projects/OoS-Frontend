import { AdminState } from 'src/app/shared/store/admin.state';
import { AdminTabsTitle } from 'src/app/shared/enum/enumUA/tech-admin/admin-tabs';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

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
