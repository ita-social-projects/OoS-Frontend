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
import { Select, Store } from '@ngxs/store';
import { RejectModalWindowComponent } from 'src/app/shared/components/reject-modal-window/reject-modal-window.component';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { BlockModalWindowComponent } from 'src/app/shared/components/block-modal-window/block-modal-window.component';
import { BlockParent, UnBlockParent } from 'src/app/shared/store/user.actions';
import { Provider } from 'src/app/shared/models/provider.model';
import { FormGroup, } from '@angular/forms';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Observable, Subject } from 'rxjs';
import { BlockedParent } from 'src/app/shared/models/block.model';
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
  ReasonFormGroup: FormGroup;
  blockedParent: BlockedParent;
    applicationParams: {
    status: string,
    showBlocked: boolean,
    workshopsId: string[],
  } = {
      status: undefined,
      showBlocked: false,
      workshopsId: []
    };

  status: ApplicationStatus;
  subrole: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

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
    this.subrole$
      .pipe(takeUntil(this.destroy$))
      .subscribe((subrole: string) => (this.subrole = subrole));
      this.status = this.application.isBlocked ? ApplicationStatus.Blocked : ApplicationStatus[this.application.status];
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
   * This method emit block Application
   * @param Application application
   */
  onBlock(): void {
    const dialogRef = this.matDialog.open(BlockModalWindowComponent, {});
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

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
