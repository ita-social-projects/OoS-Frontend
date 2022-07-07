import { NavigationBarService } from './../../shared/services/navigation-bar/navigation-bar.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Role, RoleLinks } from 'src/app/shared/enum/role';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { PersonalCabinetTitle } from 'src/app/shared/enum/enumUA/provider-admin';

@Component({
  selector: 'app-personal-cabinet',
  templateUrl: './personal-cabinet.component.html',
  styleUrls: ['./personal-cabinet.component.scss'],
})
export class PersonalCabinetComponent implements OnInit, OnDestroy {
  roles = RoleLinks;
  subrole: string;
  userRole: string;
  Role = Role;
  PersonalCabinetTitle = PersonalCabinetTitle;

  constructor(
    private store: Store,
    public navigationBarService: NavigationBarService
  ) {}

  ngOnInit(): void {
    this.userRole = this.store.selectSnapshot<string>(RegistrationState.role);
    this.subrole = this.store.selectSnapshot<string>(RegistrationState.subrole);
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createOneNavPath({
          path:'/personal-cabinet/config',
          name:
            this.userRole === 'provider'
              ? NavBarName.PersonalCabinetProvider
              : this.userRole === 'admin'
              ? NavBarName.PersonalCabinetTechAdmin
              : NavBarName.PersonalCabinetParent,
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
