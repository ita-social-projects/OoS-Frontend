import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';

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
    // this.user$.subscribe(user => this.user = user);
  }
}
