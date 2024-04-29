import { Component, Input } from '@angular/core';
import { ApplicationIcons } from '../../enum/applications';
import { ApplicationStatusDescription, ApplicationTitles } from '../../enum/enumUA/statuses';
import { ApplicationStatuses, ApplicationProviderStatuses } from '../../enum/statuses';
import { Application } from '../../models/application.model';
import { Role } from '../../enum/role';

@Component({
  selector: 'app-status-info-card',
  templateUrl: './status-info-card.component.html',
  styleUrls: ['./status-info-card.component.scss']
})
export class StatusInfoCardComponent {
  @Input() public role: Role;

  public readonly statusTitles = ApplicationTitles;
  public readonly applicationStatusDescription = ApplicationStatusDescription;
  public readonly applicationIcons = ApplicationIcons;
  public readonly statuses = ApplicationStatuses;
  public readonly providerStatuses = ApplicationProviderStatuses;
  public readonly Role = Role;

  @Input() application: Application = null;
}
