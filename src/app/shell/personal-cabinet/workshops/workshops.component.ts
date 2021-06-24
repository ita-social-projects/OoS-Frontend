import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Role } from 'src/app/shared/enum/role';
import { User } from 'src/app/shared/models/user.model';
import { AppState } from 'src/app/shared/store/app.state';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { UserState } from 'src/app/shared/store/user.state';
import { Workshop } from '../../../shared/models/workshop.model';
import { ChangePage, GetWorkshops } from '../../../shared/store/app.actions';

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

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.store.dispatch(new GetWorkshops());
    this.userRole = this.store.selectSnapshot<User>(RegistrationState.user).role;
  }
}
