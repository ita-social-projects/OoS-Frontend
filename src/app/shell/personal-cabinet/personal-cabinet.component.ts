import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Role } from 'src/app/shared/enum/role';
import { User } from 'src/app/shared/models/user.model';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';


enum RoleLinks {
  provider = 'ОРГАНІЗАЦІЮ',
  parent = 'ДИТИНУ'
}

@Component({
  selector: 'app-personal-cabinet',
  templateUrl: './personal-cabinet.component.html',
  styleUrls: ['./personal-cabinet.component.scss']
})

export class PersonalCabinetComponent implements OnInit {

  readonly role: typeof Role = Role;

  userRole: string;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.userRole = this.store.selectSnapshot<User>(RegistrationState.user).role;
  }

}
