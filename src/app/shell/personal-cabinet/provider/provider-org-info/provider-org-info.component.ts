import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Provider } from 'src/app/shared/models/provider.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-provider-org-info',
  templateUrl: './provider-org-info.component.html',
  styleUrls: ['./provider-org-info.component.scss']
})
export class ProviderOrgInfoComponent implements OnInit {

  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  provider: Provider;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.provider$.subscribe(provider => this.provider = provider)
  }

}
