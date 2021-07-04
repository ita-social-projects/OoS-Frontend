import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { createProviderSteps, OwnershipType, OwnershipTypeUkr, ProviderType, ProviderTypeUkr } from 'src/app/shared/enum/provider';
import { Provider } from 'src/app/shared/models/provider.model';
import { ActivateEditMode } from 'src/app/shared/store/app.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';

@Component({
  selector: 'app-provider-org-info',
  templateUrl: './provider-org-info.component.html',
  styleUrls: ['./provider-org-info.component.scss']
})
export class ProviderOrgInfoComponent implements OnInit {

  readonly providerType: typeof ProviderType = ProviderType;
  readonly ownershipType: typeof OwnershipType = OwnershipType;
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly providerTypeUkr = ProviderTypeUkr;
  readonly createProviderSteps = createProviderSteps;

  editLink: string = createProviderSteps[1];

  @Select(RegistrationState.provider) provider$: Observable<Provider>;

  constructor(private store: Store) { }

  ngOnInit(): void { }

  ActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.editLink= createProviderSteps[tabChangeEvent.index];
  }

}
