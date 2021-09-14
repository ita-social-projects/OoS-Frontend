import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import {ApplicationTitles, ApplicationStatusDescription} from 'src/app/shared/enum/enumUA/applications'
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

  isActiveInfoButton: boolean = false;
  @Input() application: Application = null;
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
