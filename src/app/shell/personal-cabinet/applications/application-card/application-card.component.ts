import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ApplicationStatus, ApplicationStatusUkr } from 'src/app/shared/enum/applications';
import { Role } from 'src/app/shared/enum/role';
import { Application } from 'src/app/shared/models/application.model';
@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss']
})

export class ApplicationCardComponent implements OnInit {

  readonly applicationStatusUkr = ApplicationStatusUkr;
  readonly applicationStatus = ApplicationStatus;
  readonly Role = Role;

  constructor() { }

  @Input() application: Application;
  @Input() userRole: string;

  @Output() approved = new EventEmitter();
  @Output() rejected = new EventEmitter();
  @Output() infoShow = new EventEmitter();
  @Output() infoHide = new EventEmitter();

  ngOnInit(): void { }

  /**
  * This method emit on approve action
  * @param Application application
  */
  onApprove(application: Application): void {
    this.approved.emit(application);
  }

  /**
  * This method emit on deny action
  * @param Application application
  */
  onReject(application: Application): void {
    this.rejected.emit(application);
  }

  /**
  * This method emit on mouseover action on child avatar
  * @param Application application
  */
  onInfoShow(element: Element): void {
    this.infoShow.emit({ element, child: this.application.child });
  }

  /**
  * This method emit on mouseleave action on child avatar
  * @param Application application
  */
  onInfoHide(element: Element): void {
    this.infoHide.emit();
  }
}