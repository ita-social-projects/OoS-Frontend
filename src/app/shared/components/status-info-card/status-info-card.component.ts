import { Component, Input } from '@angular/core';
import { ApplicationIcons } from '../../enum/applications';
import { ApplicationStatusDescription, ApplicationTitles } from '../../enum/enumUA/statuses';
import { ApplicationStatuses } from '../../enum/statuses';
import { Application } from '../../models/application.model';

@Component({
  selector: 'app-status-info-card',
  templateUrl: './status-info-card.component.html',
  styleUrls: ['./status-info-card.component.scss']
})
export class StatusInfoCardComponent {
  public readonly statusTitles = ApplicationTitles;
  public readonly applicationStatusDescription = ApplicationStatusDescription;
  public readonly applicationIcons = ApplicationIcons;
  public readonly statuses = ApplicationStatuses;

  @Input() application: Application = null;
}
