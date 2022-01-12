import { DetectedDeviceService } from './../../../../shared/services/detected-device.service';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { ApplicationStatus, ApplicationIcons } from 'src/app/shared/enum/applications';
import { ApplicationTitles, ApplicationStatusDescription } from 'src/app/shared/enum/enumUA/applications';
import { Role } from 'src/app/shared/enum/role';
import { Application } from 'src/app/shared/models/application.model';
import { Util } from 'src/app/shared/utils/utils';


import { MatDialog } from '@angular/material/dialog';
// import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { RejectModalWindowComponent } from 'src/app/shared/components/reject-modal-window/reject-modal-window.component';
// import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
// import { Workshop } from 'src/app/shared/models/workshop.model';
import { Select, Store } from '@ngxs/store';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss']
})


export class ApplicationCardComponent implements OnInit {

  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatus = ApplicationStatus;
  readonly applicationIcons = ApplicationIcons;
  readonly applicationStatusDescription = ApplicationStatusDescription;
  readonly constants: typeof Constants = Constants;
  readonly role = Role;
  childAge: string;
  deviceToogle: boolean;
  infoShowToggle: boolean = false;
  ReasonFormGroup: FormGroup;
  reason: string;

  @Input() application: Application;
  @Input() userRole: string;
  @Output() approved = new EventEmitter();
  @Output() rejected = new EventEmitter();
  @Output() leave = new EventEmitter();
  @Output() infoShow = new EventEmitter();
  @Output() infoHide = new EventEmitter();

  constructor(
    private detectedDevice: DetectedDeviceService,
    private store: Store,
    private matDialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.childAge = Util.getChildAge(this.application.child);
    this.deviceToogle = this.detectedDevice.checkedDevice()
  }


  onClick(event) {
    if (event.target.id === 'child-box' || event.target.parentElement.id === 'child-box' || event.target.parentElement.parentElement.id === 'child-box') return
    this.onInfoHide()
  }


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
  // onReject(application: Application): void {
  //   this.rejected.emit(application);
  // }

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
      this.infoShow.emit({ element, child: this.application.child});
      event.stopPropagation();
      this.deviceToogle && document.addEventListener('click', this.onClick.bind(this));
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

    /**
   * This method receives a form from reject-modal-window child component and assigns to the Reason
   * @param FormGroup form
   */
    //  onReceiveReasonFormGroup(form: FormGroup): void {
    //   this.ReasonFormGroup = form;
    // }

    /**
   * This method reject Application
   */
     onReject(application: Application): void {
      const dialogRef = this.matDialog.open(RejectModalWindowComponent, {
        width: '330px',
        data: {
          test: this.reason
        }
      });
  
      dialogRef.afterClosed().subscribe((result: string) => {        
          application.reason = result;
          this.rejected.emit(application);        
      });
    }

}
