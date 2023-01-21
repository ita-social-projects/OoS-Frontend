import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constants } from '../../../../../shared/constants/constants';
import { ChildDeclination, YearDeclination } from '../../../../../shared/enum/enumUA/declinations/declination';
import { Role } from '../../../../../shared/enum/role';
import { Application } from '../../../../../shared/models/application.model';
import { BlockedParent } from '../../../../../shared/models/block.model';
import { Util } from '../../../../../shared/utils/utils';
import { ApplicationStatuses } from './../../../../../shared/enum/statuses';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss'],
})
export class ApplicationCardComponent implements OnInit {
  readonly applicationStatuses = ApplicationStatuses;
  readonly constants: typeof Constants = Constants;
  readonly role = Role;
  readonly YearDeclination = YearDeclination;

  blockedParent: BlockedParent;
  childFullName: string;
  userIsAdmin: boolean;
  applicationParams: {
    status: string;
    showBlocked: boolean;
  } = {
    status: undefined,
    showBlocked: false,
  };

  @Input() isMobileView: boolean;
  @Input() application: Application;
  @Input() userRole: string;

  @Output() leave = new EventEmitter();
  @Output() approve = new EventEmitter();
  @Output() reject = new EventEmitter();
  @Output() block = new EventEmitter();
  @Output() unblock = new EventEmitter();

  get childAge(): number {
    return Util.getChildAge(this.application.child);
  }

  ngOnInit(): void {
    this.childFullName = Util.getFullName(this.application.child);

    this.setUserIsAdmin();
  }

  setUserIsAdmin(): void {
    this.userIsAdmin = this.userRole === Role.ministryAdmin || this.userRole === Role.techAdmin;
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
