import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

import { PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { RoleLinks } from 'shared/enum/enumUA/user';
import { Role, Subrole } from 'shared/enum/role';
import { ApplicationStatuses } from 'shared/enum/statuses';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath, DeleteNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { isRoleAdmin } from 'shared/utils/admin.utils';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-personal-cabinet',
  templateUrl: './personal-cabinet.component.html',
  styleUrls: ['./personal-cabinet.component.scss']
})
export class PersonalCabinetComponent implements OnInit, OnDestroy {
  public readonly ApplicationStatuses = ApplicationStatuses;
  public readonly RoleLinks = RoleLinks;
  public readonly Role = Role;
  public readonly Subrole = Subrole;
  public readonly isRoleAdmin = isRoleAdmin;

  public personalCabinetTitle: PersonalCabinetTitle;
  public userRole: Role;
  public subrole: Subrole;

  constructor(
    private store: Store,
    public navigationBarService: NavigationBarService
  ) {}

  public ngOnInit(): void {
    this.userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    this.subrole = this.store.selectSnapshot<Subrole>(RegistrationState.subrole);
    this.personalCabinetTitle = Util.getPersonalCabinetTitle(this.userRole, this.subrole);

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

  public ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
