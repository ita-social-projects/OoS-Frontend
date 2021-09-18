import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApplicationStatus, ApplicationIcons } from 'src/app/shared/enum/applications';
import { ApplicationTitles, ApplicationStatusDescription } from 'src/app/shared/enum/enumUA/applications'
import { Application } from '../../../shared/models/application.model';
@Component({
  selector: 'app-status-info-card',
  templateUrl: './status-info-card.component.html',
  styleUrls: ['./status-info-card.component.scss']
})
export class StatusInfoCardComponent implements OnInit {
  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatus = ApplicationStatus;
  readonly applicationStatusDescription = ApplicationStatusDescription;
  readonly applicationIcons = ApplicationIcons;

  @Input() application: Application = null;
  constructor() { }

  ngOnInit(): void {
  }

  getValuesFromEnum(Enum: Object) : Array<any> {
    let keys = Object.keys(Enum);
    return keys.slice(keys.length / 2);
  }
}
