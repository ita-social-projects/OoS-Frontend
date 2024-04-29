import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Constants } from 'shared/constants/constants';
import { Gender } from 'shared/enum/enumUA/gender';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { Role } from 'shared/enum/role';
import { User } from 'shared/models/user.model';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit, OnDestroy {
  public readonly gender = Gender;
  public readonly dateFormat = Constants.SHORT_DATE_FORMAT;
  public readonly role = Role;

  @Select(RegistrationState.user)
  public user$: Observable<User>;
  @Select(RegistrationState.role)
  public role$: Observable<Role>;

  public authServer: string = environment.stsServer;
  public culture: string = localStorage.getItem('ui-culture');
  public link: string;

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.PersonalInformation,
        isActive: false,
        disable: true
      })
    );
  }

  public onRedirect(link: string): void {
    window.open(`${this.authServer + link}?culture=${this.culture}&ui-culture=${this.culture}`, link, 'height=500,width=500');
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new PopNavPath());
  }
}
