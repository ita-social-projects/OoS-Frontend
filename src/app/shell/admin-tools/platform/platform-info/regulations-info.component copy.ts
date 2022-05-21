import { GetLawsAndRegulations } from './../../../../shared/store/admin.actions';
import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { Store, Select } from '@ngxs/store';
import { Component} from '@angular/core';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { AdminState } from 'src/app/shared/store/admin.state';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-regulations-info',
  template: '<app-info-card [type]="lawsAndRegulations" [platformInfo]="LawsAndRegulations$ | async"></app-info-card>',
})
export class RegulationsInfoComponent {
  readonly lawsAndRegulations = PlatformInfoType.LawsAndRegulations;

  @Select(AdminState.LawsAndRegulations)
  LawsAndRegulations$: Observable<CompanyInformation>;

  constructor(private store: Store) {
    this.store.dispatch(new GetLawsAndRegulations());
  }
}
