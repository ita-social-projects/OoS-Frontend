import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AdminTabTypes } from '../../../../../shared/enum/admins';
import { CompanyInformation } from '../../../../../shared/models/сompanyInformation.model';
import { AdminState } from '../../../../../shared/store/admin.state';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() type: AdminTabTypes;
  @Input() platformInfo: CompanyInformation;

  @Select(AdminState.isLoading)
  isLoading$: Observable<boolean>;
}
