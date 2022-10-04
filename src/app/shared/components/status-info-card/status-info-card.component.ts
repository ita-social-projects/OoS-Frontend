import { Component, Input, OnInit } from '@angular/core';
import { ApplicationIcons, ApplicationStatus } from '../../enum/applications';
import { ApplicationStatusDescription, ApplicationTitles } from '../../enum/enumUA/applications';
import { Application } from '../../models/application.model';
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

  constructor() { }

  ngOnInit(): void {}

  getValuesFromEnum(): Array<any> {
    return Object.keys(this.applicationStatus);
  }
}
