import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
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

  @Select(RegistrationState.user)
  user$: Observable<User>;
  userRole: string;
  roles = RoleLinks;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.user$.subscribe(user => {
      this.userRole = user.role
    });
  }

}
