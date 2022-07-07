import { Util } from 'src/app/shared/utils/utils';
import { NavigationBarService } from './../../shared/services/navigation-bar/navigation-bar.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Role, RoleLinks } from 'src/app/shared/enum/role';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { PersonalCabinetTitle } from 'src/app/shared/enum/navigation-bar';

@Component({
  selector: 'app-personal-cabinet',
  templateUrl: './personal-cabinet.component.html',
  styleUrls: ['./personal-cabinet.component.scss'],
})
export class PersonalCabinetComponent implements OnInit, OnDestroy {
  roles = RoleLinks;
  Role = Role;
  personalCabinetTitle: PersonalCabinetTitle;
  userRole: Role;
  subRole: Role;

  constructor(
    private store: Store,
    public navigationBarService: NavigationBarService
  ) {}

  ngOnInit(): void {
    this.userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    this.subRole  = this.store.selectSnapshot<Role>(RegistrationState.subrole);
    this.personalCabinetTitle = Util.getPersonalCabinetTitle(this.userRole, this.subRole);

    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createOneNavPath({
          path:'/personal-cabinet/config',
          name: this.personalCabinetTitle,
          isActive: false,
          disable: false,
        })
      )
    );    
  }
  
  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
