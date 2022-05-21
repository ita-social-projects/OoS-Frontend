import { GetSupportInformation } from './../../../../shared/store/admin.actions';
import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { Store, Select } from '@ngxs/store';
import { Component} from '@angular/core';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { AdminState } from 'src/app/shared/store/admin.state';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-support-info',
  template: '<app-info-card [type]="supportInformation" [platformInfo]="SupportInformation$ | async"></app-info-card>',
})
export class SupportInfoComponent {
  readonly supportInformation = PlatformInfoType.SupportInformation;

  @Select(AdminState.SupportInformation)
  SupportInformation$: Observable<CompanyInformation>;

  constructor(private store: Store) {
    this.store.dispatch(new GetSupportInformation());

  }
}
