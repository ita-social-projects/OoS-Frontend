import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { CompanyInformation } from '../../../../shared/models/сompanyInformation.model';
import { AdminState } from '../../../../shared/store/admin.state';
import { AdminTabTypes } from '../../../../shared/enum/admins';

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
