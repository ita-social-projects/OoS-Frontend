import { PopNavPath } from './../../../shared/store/navigation.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/shared/constants/constants';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit, OnDestroy {
  readonly phonePrefix = Constants.PHONE_PREFIX;

  @Select(RegistrationState.user)
  user$: Observable<User>;
  
  authServer: string = environment.stsServer;
  culture: string = localStorage.getItem('ui-culture');;
  link: string;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(
      new PushNavPath(
        [{
          name: NavBarName.UserInfo,
          isActive: false,
          disable: true,
        }]
      )
    );    
  }

  onRedirect(link: string): void {
    window.open(`${this.authServer + link}?culture=${this.culture}&ui-culture=${this.culture}`, link, 'height=500,width=500');
  }

  ngOnDestroy(): void {
    this.store.dispatch(new PopNavPath());
  }
}
