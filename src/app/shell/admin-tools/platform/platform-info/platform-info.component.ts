import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { Store } from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { GetPlatformInfo } from 'src/app/shared/store/admin.actions';

@Component({
  selector: 'app-platform-info',
  templateUrl: './platform-info.component.html',
  styleUrls: ['./platform-info.component.scss']
})
export class PlatformInfoComponent {
  @Input() type: PlatformInfoType;
  @Input() platformInfo: CompanyInformation;

  constructor(

    private store: Store) {

      this.store.dispatch(new GetPlatformInfo())// routing fix but performance issue
  }
}
