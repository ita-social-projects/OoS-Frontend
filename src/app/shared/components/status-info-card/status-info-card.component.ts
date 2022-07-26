import { Component, Input, OnInit } from '@angular/core';
import { ApplicationIcons, ApplicationStatus } from 'src/app/shared/enum/applications';
import { ApplicationTitles, ApplicationStatusDescription } from 'src/app/shared/enum/enumUA/applications';
import { Application } from '../../../shared/models/application.model';
@Component({
  selector: 'app-status-info-card',
  templateUrl: './status-info-card.component.html',
  styleUrls: ['./status-info-card.component.scss']
})
export class StatusInfoCardComponent implements OnInit {

  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatusDescription = ApplicationStatusDescription;
  readonly applicationIcons = ApplicationIcons;
  readonly applicationStatus = ApplicationStatus;

  @Input() application: Application = null;
  @Input() status: ApplicationStatus;

  constructor() { }

  ngOnInit(): void {}

  getValuesFromEnum(): Array<any> {
    return Object.keys(this.applicationStatus);
  }
}
