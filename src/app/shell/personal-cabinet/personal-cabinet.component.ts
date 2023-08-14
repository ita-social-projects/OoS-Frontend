import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

import { PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { RoleLinks } from 'shared/enum/enumUA/user';
import { Role } from 'shared/enum/role';
import { ApplicationStatuses } from 'shared/enum/statuses';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath, DeleteNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';
import { isRoleAdmin } from '../admin-tools/admin-tools.guard';

@Component({
  selector: 'app-personal-cabinet',
  templateUrl: './personal-cabinet.component.html',
  styleUrls: ['./personal-cabinet.component.scss']
})
export class PersonalCabinetComponent implements OnInit, OnDestroy {
  readonly ApplicationStatuses = ApplicationStatuses;
  readonly roles = RoleLinks;
  readonly Role = Role;
  protected isRoleAdmin = isRoleAdmin;

  personalCabinetTitle: PersonalCabinetTitle;
  userRole: Role;
  subRole: Role;

  constructor(private store: Store, public navigationBarService: NavigationBarService) {}

  ngOnInit(): void {
    this.userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    this.subRole = this.store.selectSnapshot<Role>(RegistrationState.subrole);
    this.personalCabinetTitle = Util.getPersonalCabinetTitle(this.userRole, this.subRole);

    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createOneNavPath({
          path: '/personal-cabinet/config',
          name: this.personalCabinetTitle,
          isActive: false,
          disable: false
        })
      )
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
