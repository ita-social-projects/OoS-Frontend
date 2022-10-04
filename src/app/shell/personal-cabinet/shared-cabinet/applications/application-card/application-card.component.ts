import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constants } from '../../../../../shared/constants/constants';
import { ApplicationStatus, ApplicationIcons } from '../../../../../shared/enum/applications';
import { ApplicationTitles, ApplicationStatusDescription } from '../../../../../shared/enum/enumUA/applications';
import { Role } from '../../../../../shared/enum/role';
import { Application } from '../../../../../shared/models/application.model';
import { BlockedParent } from '../../../../../shared/models/block.model';
import { Util } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss'],
})
export class ApplicationCardComponent implements OnInit {
  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatus = ApplicationStatus;
  readonly applicationIcons = ApplicationIcons;
  readonly applicationStatusDescription = ApplicationStatusDescription;
  readonly constants: typeof Constants = Constants;
  readonly role = Role;

  childAge: string;
  blockedParent: BlockedParent;
  childFullName: string;
  applicationParams: {
    status: string;
    showBlocked: boolean;
  } = {
    status: undefined,
    showBlocked: false,
  };

  @Input() application: Application;
  @Input() userRole: string;

  @Output() leave = new EventEmitter();
  @Output() approve = new EventEmitter();
  @Output() reject = new EventEmitter();
  @Output() block = new EventEmitter();
  @Output() unblock = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.childAge = Util.getChildAge(this.application.child);
    this.childFullName = Util.getFullName(this.application.child);
  }

  /**
   * This method emit on approve action
   * @param Application application
   */
  onApprove(application: Application): void {
    this.approve.emit(application);
  }

  /**
   * This method emit reject Application
   * @param Application application
   */
  onReject(application: Application): void {
    this.reject.emit(application);
  }

  /**
   * This method changes status of emitted event to "left"
   * @param Application event
   */
  onLeave(application: Application): void {
    this.leave.emit(application);
  }

  /**
   * This method emit block Application
   * @param Application application
   */
  onBlock(): void {
    this.block.emit(this.application.parentId);
  }

  /**
   * This method emit unblock Application
   */
  onUnBlock(): void {
    this.unblock.emit(this.application.parentId);
  }
}
