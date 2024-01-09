import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { RoleLinks } from 'shared/enum/enumUA/user';
import { Role, Subrole } from 'shared/enum/role';
import { ApplicationStatuses } from 'shared/enum/statuses';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { GetUnreadMessagesCount } from 'shared/store/chat.actions';
import { ChatState } from 'shared/store/chat.state';
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
  readonly ApplicationStatuses = ApplicationStatuses;
  readonly roles = RoleLinks;
  readonly Role = Role;
  readonly Subrole = Subrole;
  protected isRoleAdmin = isRoleAdmin;

  personalCabinetTitle: PersonalCabinetTitle;
  userRole: Role;
  subrole: Subrole;

  @Select(ChatState.unreadMessagesCount)
  public unreadMessagesCount$: Observable<number>;

  constructor(private store: Store, public navigationBarService: NavigationBarService) {}

  ngOnInit(): void {
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

    this.store.dispatch(new GetUnreadMessagesCount());
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
