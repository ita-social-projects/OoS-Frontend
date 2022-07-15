import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'src/app/shared/constants/constants';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Application, ApplicationCards, ApplicationParameters, ApplicationUpdate } from 'src/app/shared/models/application.model';
import { Child, ChildCards } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';
import { GetAllUsersChildren, GetApplicationsByParentId, UpdateApplication } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { ParentComponent } from '../parent.component';

const activeStatuses = [
  ApplicationStatus.Pending,
  ApplicationStatus.Approved,
  ApplicationStatus.AcceptedForSelection,
  ApplicationStatus.StudyingForYears,
];
const inactiveStatuses = [
  ApplicationStatus.Pending,
  ApplicationStatus.Approved,
  ApplicationStatus.AcceptedForSelection,
  ApplicationStatus.StudyingForYears,
];
@Component({
  selector: 'app-parent-workshops',
  templateUrl: './parent-workshops.component.html',
  styleUrls: ['./parent-workshops.component.scss'],
})
export class ParentWorkshopsComponent extends ParentComponent implements OnInit, OnDestroy {
  readonly noParentWorkshops = NoResultsTitle.noParentWorkshops;
  readonly applicationStatus = ApplicationStatus;

  @Select(UserState.workshops)
  workshops$: Observable<WorkshopCard[]>;
  @Select(UserState.children)
  children$: Observable<ChildCards>;
  @Select(UserState.applications)
  applicationCards$: Observable<ApplicationCards>;
  children: ChildCards;
  statuses: ApplicationStatus[] = activeStatuses;

  parentWorkshops: {
    child: Child,
    application: ApplicationCards
  }[] = [];

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  /**
   * This method set navigation path
   */
  addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Workshops,
        isActive: false,
        disable: true,
      })
    );
  }

  /**
   * This method subscribe on parent and get children to display their workshops
   */
  initParentData(): void {
    // this.getParentChildren();
    // this.applicationCards$
    // .pipe(
    //   filter((applicationCards: ApplicationCards) => !!applicationCards),
    //   takeUntil(this.destroy$)
    // )
    // .subscribe((applicationCards: ApplicationCards) => {

    // });
  }
  /**
   * This method get children by parent id
   */
  private getParentChildren(): void {
    this.store.dispatch(new GetAllUsersChildren());
    this.children$
      .pipe(
        filter((children: ChildCards) => !!children),
        takeUntil(this.destroy$),
        map((children: ChildCards)=> children.entities.map((child: Child)=> child.id))
      ).subscribe((childredIds: string[]) => this.getChildApplications(childredIds));
  }

    /**
   * This method get parent children and applications to display workshops
   */
     getChildApplications(childredIds: string[]): void {
      const params: ApplicationParameters = {
        showBlocked: false,
        children: childredIds,
        statuses: this.statuses,
        workshops: [],
        size: 4
      };
      this.store.dispatch(new GetApplicationsByParentId(this.parent.id, params));
    }

  onTabChange(event: MatTabChangeEvent): void {
    this.statuses = event.index ? inactiveStatuses : activeStatuses;
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
