import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Provider } from 'src/app/shared/models/provider.model';
import { User } from 'src/app/shared/models/user.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { GetProviderById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-provider-config',
  templateUrl: './provider-config.component.html',
  styleUrls: ['./provider-config.component.scss']
})
export class ProviderConfigComponent implements OnInit {

  @Select(RegistrationState.user)
  user$: Observable<User>;
  user: User;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.user$.subscribe(user => this.user = user);
  }
}
