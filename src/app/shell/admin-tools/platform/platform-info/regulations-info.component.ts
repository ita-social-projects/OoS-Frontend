import { AdminTabs } from 'src/app/shared/enum/enumUA/tech-admin/admin-tabs';
import { Select } from '@ngxs/store';
import { Component } from '@angular/core';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { AdminState } from 'src/app/shared/store/admin.state';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-regulations-info',
  template: '<app-info-card [type]="lawsAndRegulations" [platformInfo]="LawsAndRegulations$ | async"></app-info-card>',
})
export class RegulationsInfoComponent {
  readonly lawsAndRegulations = AdminTabs.LawsAndRegulations;

  @Select(AdminState.LawsAndRegulations)
  LawsAndRegulations$: Observable<CompanyInformation>;

  constructor() {}

}
