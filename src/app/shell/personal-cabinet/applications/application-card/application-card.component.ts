import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
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
  readonly constants: typeof Constants = Constants;
  readonly role = Role;

  constructor() { }

  @Input() application: Application;
  @Input() childAge: string;

  @Input() userRole: string;

  @Output() approved = new EventEmitter();
  @Output() rejected = new EventEmitter();
  @Output() leave = new EventEmitter();

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
  * This method emit on deny action
  * @param Application application
  */
  onLeave(application: Application): void {
    this.leave.emit(application);
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
  onInfoHide(): void {
    this.infoHide.emit();
  }

}