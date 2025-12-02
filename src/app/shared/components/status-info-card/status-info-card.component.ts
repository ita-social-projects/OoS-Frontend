import { Component, Input } from '@angular/core';
import { isRoleProvider } from 'shared/utils/provider.utils';
import { ApplicationIcons } from '../../enum/applications';
import { ApplicationStatusDescription, ApplicationTitles } from '../../enum/enumUA/statuses';
import { ApplicationStatuses } from '../../enum/statuses';
import { Role } from '../../enum/role';

@Component({
  selector: 'app-status-info-card',
  templateUrl: './status-info-card.component.html',
  styleUrls: ['./status-info-card.component.scss']
})
export class StatusInfoCardComponent {
  public readonly statusTitles = ApplicationTitles;
  public readonly applicationStatusDescription = ApplicationStatusDescription;
  public readonly applicationIcons = ApplicationIcons;
  public readonly Role = Role;

  public statuses: ApplicationStatuses[] = [];
  private _role: Role;

  public get role(): Role {
    return this._role;
  }

  @Input()
  public set role(value: Role) {
    this._role = value;
    this.setStatuses();
  }

  private setStatuses(): void {
    this.statuses = isRoleProvider(this.role)
      ? Object.values(ApplicationStatuses)
      : Object.values(ApplicationStatuses).filter((status: ApplicationStatuses) => status !== ApplicationStatuses.Banned);
  }
}
