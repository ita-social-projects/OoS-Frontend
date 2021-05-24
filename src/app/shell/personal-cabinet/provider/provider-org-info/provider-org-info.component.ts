import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Provider } from 'src/app/shared/models/provider.model';
import { GetProviderById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-provider-org-info',
  templateUrl: './provider-org-info.component.html',
  styleUrls: ['./provider-org-info.component.scss']
})
export class ProviderOrgInfoComponent implements OnInit {

  @Select(UserState.provider)
  provider$: Observable<Provider>;
  provider: Provider;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetProviderById(null));
    this.provider$.subscribe(provider => this.provider = provider)
  }

}
