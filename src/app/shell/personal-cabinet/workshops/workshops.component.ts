import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'src/app/shared/constants/constants';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Role } from 'src/app/shared/enum/role';
import { Application, ApplicationUpdate } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { DeleteWorkshopById, UpdateApplication } from 'src/app/shared/store/user.actions';
import { Util } from 'src/app/shared/utils/utils';
import { WorkshopCard } from '../../../shared/models/workshop.model';
import { CabinetDataComponent } from '../cabinet-data/cabinet-data.component';

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss']
})
export class WorkshopsComponent extends CabinetDataComponent implements OnInit {

  readonly noParentWorkshops = NoResultsTitle.noParentWorkshops;
  @ViewChild('WorkshopsWrap') workshopsWrap: ElementRef;
  getEmptyCards = Util.getEmptyCards;
  widthOfWorkshopCard = Constants.WIDTH_OF_WORKSHOP_CARD_WITH_MARGINE;
  constructor(store: Store, matDialog: MatDialog) {
    super(store, matDialog);
  }

  ngOnInit(): void {
    this.getUserData();
  }

  init(): void {
    if (this.role === Role.provider) {
      this.getProviderWorkshops();
      this.getProviderApplications({
        status: ApplicationStatus.Pending,
        workshopsId: []
      });
    } else {
      this.getAllUsersChildren();
      this.getParentApplications();
    }
  }

  isApplications(applications: Application[], child: Child): boolean {
    return applications.some((application: Application) => application.child.id === child.id);
  }
  /**
   * This method delete workshop By Workshop Id
   */
  onDelete(workshop: WorkshopCard): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: {
        type: ModalConfirmationType.delete,
        property: workshop.title
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.store.dispatch(new DeleteWorkshopById(workshop));

    });
  }

  /**
   * This method changed the target application status to "leave"
   */
  onLeaveWorkshops(application: Application): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: {
        type: ModalConfirmationType.leaveWorkshop,
        property: application.workshop.title
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const applicationUpdate = new ApplicationUpdate(application.id, ApplicationStatus.Left);
        this.store.dispatch(new UpdateApplication(applicationUpdate));
      }
    });
  }
}
