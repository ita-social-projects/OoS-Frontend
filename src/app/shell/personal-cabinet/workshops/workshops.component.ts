import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { Role } from 'src/app/shared/enum/role';
import { Application, ApplicationUpdate } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { User } from 'src/app/shared/models/user.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { DeleteWorkshopById, GetApplicationsByParentId, GetChildrenByParentId, GetWorkshopsByProviderId, UpdateApplication } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { Workshop } from '../../../shared/models/workshop.model';

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss']
})
export class WorkshopsComponent implements OnInit {

  readonly applicationStatus = ApplicationStatus;
  readonly role: typeof Role = Role;

  @Select(UserState.workshops)
  workshops$: Observable<Workshop[]>;
  @Select(UserState.applications)
  applications$: Observable<Application[]>;
  @Select(UserState.children)
  children$: Observable<Child[]>;

  userRole: string;
  id: number;

  constructor(private store: Store, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.userRole = this.store.selectSnapshot<User>(RegistrationState.user).role;
    (this.userRole === Role.provider) ? this.getProviderWorkshops() : this.getParentWorkshops();
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

  /**
  * This method get workshops by provider id
  */
  private getProviderWorkshops(): void {
    this.id = this.store.selectSnapshot<Provider>(RegistrationState.provider).id;
    this.store.dispatch(new GetWorkshopsByProviderId(this.id));
  }

  /**
  * This method get applications by Parent Id
  */
  private getParentWorkshops(): void {
    this.id = this.store.selectSnapshot<Parent>(RegistrationState.parent).id;
    this.store.dispatch(new GetChildrenByParentId(this.id));
    this.store.dispatch(new GetApplicationsByParentId(this.id));
  }
}
