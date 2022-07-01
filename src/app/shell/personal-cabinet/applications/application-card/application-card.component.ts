import { DetectedDeviceService } from './../../../../shared/services/detected-device.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import {
  ApplicationStatus,
  ApplicationIcons,
} from 'src/app/shared/enum/applications';
import {
  ApplicationTitles,
  ApplicationStatusDescription,
} from 'src/app/shared/enum/enumUA/applications';
import { Role } from 'src/app/shared/enum/role';
import { Application } from 'src/app/shared/models/application.model';
import { Util } from 'src/app/shared/utils/utils';
import { MatDialog } from '@angular/material/dialog';
import { RejectModalWindowComponent } from 'src/app/shared/components/reject-modal-window/reject-modal-window.component';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss'],
})
export class ApplicationCardComponent implements OnInit {
  @Select(RegistrationState.subrole)
  subrole$: Observable<string>;

  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatus = ApplicationStatus;
  readonly applicationIcons = ApplicationIcons;
  readonly applicationStatusDescription = ApplicationStatusDescription;
  readonly constants: typeof Constants = Constants;
  readonly role = Role;
  childAge: string;
  deviceToogle: boolean;
  infoShowToggle: boolean = false;
  subrole: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() application: Application;
  @Input() userRole: string;
  @Output() approved = new EventEmitter();
  @Output() rejected = new EventEmitter();
  @Output() leave = new EventEmitter();
  @Output() infoShow = new EventEmitter();
  @Output() infoHide = new EventEmitter();
  @Output() passApplication = new EventEmitter();

  constructor(
    private detectedDevice: DetectedDeviceService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.childAge = Util.getChildAge(this.application.child);
    this.deviceToogle = this.detectedDevice.checkedDevice();
    this.subrole$
      .pipe(takeUntil(this.destroy$))
      .subscribe((subrole: string) => (this.subrole = subrole));
    if (this.application.isBlocked) {
      const applicationStatusBlocked = "Blocked";
      this.application.status = applicationStatusBlocked;
    }
  }

  onClick(event) {
    if (
      event.target.id === 'child-box' ||
      event.target.parentElement.id === 'child-box' ||
      event.target.parentElement.parentElement.id === 'child-box'
    )
      return;
    this.onInfoHide();
  }

  /**
   * This method emit on approve action
   * @param Application application
   */
  onApprove(application: Application): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.approveApplication,
        property: '',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.approved.emit(application);
      }
    });
  }

  /**
   * This method emit reject Application
   * @param Application application
   */
  onReject(application: Application): void {
    const dialogRef = this.matDialog.open(RejectModalWindowComponent, {});
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        application.rejectionMessage = result;
        this.rejected.emit(application);
      }
    });
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
  onInfoShow(element: Element, event): void {
    if (!this.infoShowToggle) {
      this.infoShowToggle = true;
      this.infoShow.emit({ element, child: this.application.child });
      event.stopPropagation();
      this.deviceToogle &&
        document.addEventListener('click', this.onClick.bind(this));
    } else {
      this.onInfoHide();
    }
  }

  /**
   * This method emit on mouseleave action on child avatar
   * @param Application application
   */
  onInfoHide(): void {
    this.infoShowToggle = false;
    this.infoHide.emit();
    this.deviceToogle && document.removeEventListener('click', this.onClick.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

}
