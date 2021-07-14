import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Role } from 'src/app/shared/enum/role';
import { Application } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { User } from 'src/app/shared/models/user.model';
import { AppState } from 'src/app/shared/store/app.state';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { DeleteWorkshopById, GetApplicationsByParentId, GetWorkshopsByParentId, GetWorkshopsByProviderId } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { Workshop } from '../../../shared/models/workshop.model';
import { GetWorkshops } from '../../../shared/store/app.actions';

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss']
})
export class WorkshopsComponent implements OnInit {

  readonly role: typeof Role = Role;

  @Select(UserState.workshops)
  workshops$: Observable<Workshop[]>;
  @Select(UserState.applications)
  applications$: Observable<Application[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  workshops: Workshop[];
  children: Child[];
  userRole: string;
  id: number;

  constructor(private store: Store, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.userRole = this.store.selectSnapshot<User>(RegistrationState.user).role;
    this.getWorkshops();
  }

  onDelete(workshop: Workshop): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: 'Видалити гурток?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new DeleteWorkshopById(workshop));
      }
    });
  }
  getWorkshops(): void {

    if (this.userRole === Role.provider) {
      this.id = this.store.selectSnapshot<Provider>(RegistrationState.provider).id;
      this.store.dispatch(new GetWorkshopsByProviderId(this.id));
      this.workshops$.pipe(takeUntil(this.destroy$)).subscribe((workshops: Workshop[]) => this.workshops = workshops);
    } else {
      this.id = this.store.selectSnapshot<Parent>(RegistrationState.parent).id;
      this.store.dispatch(new GetApplicationsByParentId(this.id));
      this.applications$.pipe(takeUntil(this.destroy$)).subscribe((applications: Application[]) => console.log(applications));
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
