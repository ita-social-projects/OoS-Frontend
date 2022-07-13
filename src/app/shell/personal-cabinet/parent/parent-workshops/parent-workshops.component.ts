import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'src/app/shared/constants/constants';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Application, ApplicationUpdate } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { UpdateApplication } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { CabinetDataComponent } from '../../cabinet-data/cabinet-data.component';

@Component({
  selector: 'app-parent-workshops',
  templateUrl: './parent-workshops.component.html',
  styleUrls: ['./parent-workshops.component.scss'],
})
export class ParentWorkshopsComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  readonly noParentWorkshops = NoResultsTitle.noParentWorkshops;

  @Select(UserState.workshops)
  workshops$: Observable<WorkshopCard[]>;

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  /**
   * This method subscribe on parent and get it's data for workshops
   */
  init(): void {
    this.parent$
      .pipe(
        filter((parent: Parent) => !!parent),
        takeUntil(this.destroy$)
      )
      .subscribe((parent: Parent) => {
        this.parent = parent;
        this.getParentWorkshops();
      });
  }
  /**
   * This method get parent children and applications to display workshops
   */
  getParentWorkshops(): void {
    this.getAllUsersChildren();
    this.getParentApplications({
      status: ApplicationStatus.Pending,
      workshopsId: [],
      showBlocked: false,
    });
  }

  isApplications(applications: Application[], child: Child): boolean {
    return applications.some((application: Application) => application.child.id === child.id);
  }

  /**
   * This method changed the target application status to "leave"
   */
  onLeaveWorkshops(application: Application): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.leaveWorkshop,
        property: application.workshop.title,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const applicationUpdate = new ApplicationUpdate(application.id, ApplicationStatus.Left);
        this.store.dispatch(new UpdateApplication(applicationUpdate));
      }
    });
  }
}
