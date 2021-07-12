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
  authServer: string;

  constructor() { }

  ngOnInit(): void {
    this.authServer = environment.stsServer;
  }
}
