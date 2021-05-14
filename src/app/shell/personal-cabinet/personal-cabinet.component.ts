import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { UserRegistrationState } from 'src/app/shared/store/user.state';

enum RoleLinks {
  provider = 'provider',
  parent = 'parent'
}

@Component({
  selector: 'app-personal-cabinet',
  templateUrl: './personal-cabinet.component.html',
  styleUrls: ['./personal-cabinet.component.scss']
})

export class PersonalCabinetComponent implements OnInit {

  @Select(UserRegistrationState.role)
  userRole$: Observable<string>;
  role: string;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.userRole$.subscribe(value => {
      this.role = value;
    });
  }

}
