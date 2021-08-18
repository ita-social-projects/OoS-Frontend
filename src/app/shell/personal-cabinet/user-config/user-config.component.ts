import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {

  @Select(RegistrationState.user)
  user$: Observable<User>;
  authServer: string = environment.stsServer;
  link: string;

  constructor() { }

  ngOnInit(): void {

  }

  onRedirect(link: string): void {
    window.open(this.authServer + link, "windowName", "height=500,width=500");
  }
}
