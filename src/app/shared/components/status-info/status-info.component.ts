import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ApplicationStatus, ApplicationTitles, ApplicationStatusDescription } from 'src/app/shared/enum/applications';
import { Application } from '../../../shared/models/application.model';

@Component({
  selector: 'app-status-info',
  templateUrl: './status-info.component.html',
  styleUrls: ['./status-info.component.scss']
})
export class StatusInfoComponent implements OnInit {
  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatus = ApplicationStatus;
  readonly applicationStatusDescription = ApplicationStatusDescription;
  constructor() { }

  ngOnInit(): void {
  }

}