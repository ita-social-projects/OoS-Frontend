import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { Provider } from 'src/app/shared/models/provider.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { ActivateEditMode } from 'src/app/shared/store/app.actions';

@Component({
  selector: 'app-provider-org-info',
  templateUrl: './provider-org-info.component.html',  
})
export class ProviderOrgInfoComponent {
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;

  constructor(private store: Store) {}

}
