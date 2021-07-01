import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Role } from 'src/app/shared/enum/role';
import { User } from 'src/app/shared/models/user.model';
import { AppState } from 'src/app/shared/store/app.state';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { DeleteWorkshopById } from 'src/app/shared/store/user.actions';
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

  @Select(AppState.allWorkshops)
  workshops$: Observable<Workshop[]>;
  userRole: string;

  constructor(private store: Store, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshops());
    this.userRole = this.store.selectSnapshot<User>(RegistrationState.user).role;
  }

  onDelete(workshopId: number): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: 'Видалити гурток?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new DeleteWorkshopById(workshopId));
      }
    });
  }
}
