import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ApplicationStatus, ApplicationTitles, ApplicationStatusDescription } from 'src/app/shared/enum/applications';
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
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  @Input() application: Application;
  constructor() { }

  ngOnInit(): void {
  }

  openStatusMenu() {
    this.trigger.openMenu();
  }
  closeStatusMenu() {
    this.trigger.closeMenu();
  }
}
