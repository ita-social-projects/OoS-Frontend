import { NavigationBarService } from './../../shared/services/navigation-bar/navigation-bar.service';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Role } from 'src/app/shared/enum/role';
import { User } from 'src/app/shared/models/user.model';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
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

export class PersonalCabinetComponent implements OnInit,OnDestroy {

  roles = RoleLinks;
  userRole: string;

  constructor(
    private store: Store,
    public navigationBarService: NavigationBarService,
    ) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.userRole = this.store.selectSnapshot<User>(RegistrationState.user).role;
    this.store.dispatch(new AddNavPath(this.navigationBarService.creatOneNavPath(
      {name: "Кабінет користувача", isActive: false, disable: true}
      )))
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
