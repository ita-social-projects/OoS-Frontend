import { Component, Input, OnInit } from '@angular/core';
import { ApplicationIcons } from '../../enum/applications';
import { ApplicationStatusDescription } from '../../enum/enumUA/applications';
import { Titles } from '../../enum/enumUA/titles';
import { Statuses } from '../../enum/statuses';
import { Application } from '../../models/application.model';
@Component({
  selector: 'app-status-info-card',
  templateUrl: './status-info-card.component.html',
  styleUrls: ['./status-info-card.component.scss']
})
export class StatusInfoCardComponent implements OnInit {
  readonly titles = Titles;
  readonly applicationStatusDescription = ApplicationStatusDescription;
  readonly applicationIcons = ApplicationIcons;
  readonly statuses = Statuses;

  @Input() application: Application = null;

  constructor() {}

  ngOnInit(): void {}

  getValuesFromEnum(): Array<string> {
    return Object.keys(this.statuses);
  }
}
