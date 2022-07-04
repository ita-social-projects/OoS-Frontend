import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent {
  readonly phonePrefix = Constants.PHONE_PREFIX;
  public culture: string = localStorage.getItem('ui-culture');;

  @Select(RegistrationState.user)
  user$: Observable<User>;
  authServer: string = environment.stsServer;
  link: string;

  constructor() { }

  onRedirect(link: string): void {
    window.open(`${this.authServer + link}?culture=${this.culture}&ui-culture=${this.culture}`, link, 'height=500,width=500');
  }
}
