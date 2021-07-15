import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { Role } from 'src/app/shared/enum/role';
import { Application, ApplicationUpdate } from 'src/app/shared/models/application.model';
import { DeleteWorkshopById, UpdateApplication } from 'src/app/shared/store/user.actions';
import { Workshop } from '../../../shared/models/workshop.model';
import { CabinetDataComponent } from '../cabinet-data/cabinet-data.component';

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss']
})
export class WorkshopsComponent extends CabinetDataComponent implements OnInit {

  constructor(store: Store, private matDialog: MatDialog) {
    super(store);
  }

  ngOnInit(): void {
    this.getUserData();

    if (this.userRole === Role.provider) {
      this.getProviderWorkshops();
    } else {
      this.getParenApplications();
      this.getParenChildren();
    }
  }

  /**
 * This method delete workshop By Workshop Id
 */
  onDelete(workshop: Workshop): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: 'Видалити гурток?'
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
      data: 'Залишити гурток?'
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const applicationUpdate = new ApplicationUpdate(application.id, ApplicationStatus.left);
        this.store.dispatch(new UpdateApplication(applicationUpdate));
      }
    });
  }
}
