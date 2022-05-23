import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { AdminState } from 'src/app/shared/store/admin.state';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() type: PlatformInfoType;
  @Input() platformInfo: CompanyInformation;

  @Select(AdminState.isLoading)
  isLoading$: Observable<boolean>;

  constructor() { }
}
