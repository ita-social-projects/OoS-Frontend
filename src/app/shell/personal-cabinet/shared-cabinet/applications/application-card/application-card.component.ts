import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { Store } from '@ngxs/store';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { ReasonModalWindowComponent } from 'src/app/shell/personal-cabinet/shared-cabinet/applications/reason-modal-window/reason-modal-window.component';
import { BlockParent, UnBlockParent } from 'src/app/shared/store/user.actions';
import { Provider } from 'src/app/shared/models/provider.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { BlockedParent } from 'src/app/shared/models/block.model';

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
    status: string,
    showBlocked: boolean,
  } = {
      status: undefined,
      showBlocked: false,
    };

  @Input() application: Application;
  @Input() userRole: string;

  @Output() approved = new EventEmitter();
  @Output() rejected = new EventEmitter();
  @Output() leave = new EventEmitter();

  constructor(
    private matDialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.childAge = Util.getChildAge(this.application.child);
    this.childFullName = Util.getFullName(this.application.child);
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
    const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
      data: {type: ModalConfirmationType.reject }});
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        application.rejectionMessage = result;
        this.rejected.emit(application);
      }
    });
  }

  /**
   * This method emit block Application
   * @param Application application
   */
  onBlock(): void {
    const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
      data: {type: ModalConfirmationType.blockParent }});
    dialogRef.afterClosed().subscribe((result: string)  => {
      if(result) {
        const providerId = this.store.selectSnapshot<Provider>(RegistrationState.provider).id;
        const parentId = this.application.parentId;
        const blockedParent = new BlockedParent( parentId, providerId, result);
        this.store.dispatch(new BlockParent(blockedParent));
        }
    });
  }

  /**
   * This method emit unblock Application
   * @param Application application
   */
  onUnBlock(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.unBlockParent,
      }
    });
    dialogRef.afterClosed().subscribe((result: string)  => {
      if(result) {
        const providerId = this.store.selectSnapshot<Provider>(RegistrationState.provider).id;
        const parentId = this.application.parentId;
        const blockedParent = new BlockedParent( parentId, providerId);
        this.store.dispatch(new UnBlockParent(blockedParent));
        }
    });
  }
}
