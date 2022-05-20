import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { Select } from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';

@Component({
  selector: 'app-platform-info',
  templateUrl: './platform-info.component.html',
  styleUrls: ['./platform-info.component.scss']
})
export class PlatformInfoComponent {
  @Input() type: PlatformInfoType;

  @Select(AdminState.platformInfo)
  platformInfo$: Observable<CompanyInformation>;

  constructor( ) {  }
}
