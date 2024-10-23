import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AdminTabTypes } from 'shared/enum/admins';
import { CompanyInformation } from 'shared/models/company-information.model';
import { AdminState } from 'shared/store/admin.state';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() public type: AdminTabTypes;
  @Input() public platformInfo: CompanyInformation;

  @Select(AdminState.isLoading)
  public isLoading$: Observable<boolean>;
}
