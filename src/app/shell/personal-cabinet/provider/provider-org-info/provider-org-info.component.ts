import { PopNavPath } from '../../../../shared/store/navigation.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Provider } from 'src/app/shared/models/provider.model';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';

@Component({
  selector: 'app-provider-org-info',
  templateUrl: './provider-org-info.component.html',
  styleUrls: ['./provider-org-info.component.scss'],
})
export class ProviderOrgInfoComponent implements OnInit, OnDestroy{
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(
      new PushNavPath(
        {
          name: NavBarName.ProviderInfo,
          isActive: false,
          disable: true,
        }
      )
    );       
  }

  ngOnDestroy(): void {
    this.store.dispatch(new PopNavPath());
  }
}
