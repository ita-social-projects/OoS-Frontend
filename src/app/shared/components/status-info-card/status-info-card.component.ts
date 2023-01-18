import { Component, Input } from '@angular/core';
import { ApplicationIcons } from '../../enum/applications';
import { ApplicationStatusDescription, ApplicationTitles } from '../../enum/enumUA/applications';
import { ApplicationStatuses } from '../../enum/statuses';
import { Application } from '../../models/application.model';
@Component({
  selector: 'app-status-info-card',
  templateUrl: './status-info-card.component.html',
  styleUrls: ['./status-info-card.component.scss'],
})
export class StatusInfoCardComponent {
  readonly statusTitles = ApplicationTitles;
  readonly applicationStatusDescription = ApplicationStatusDescription;
  readonly applicationIcons = ApplicationIcons;
  readonly statuses = ApplicationStatuses;

  @Input() application: Application = null;
}
