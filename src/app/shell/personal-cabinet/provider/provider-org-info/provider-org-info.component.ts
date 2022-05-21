import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import {
  createProviderSteps,
  OwnershipType,
  OwnershipTypeUkr,
  ProviderType,
  ProviderTypeUkr,
} from 'src/app/shared/enum/provider';

import { Provider } from 'src/app/shared/models/provider.model';
import { ActivateEditMode } from 'src/app/shared/store/app.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-provider-org-info',
  templateUrl: './provider-org-info.component.html',
  styleUrls: ['./provider-org-info.component.scss'],
})
export class ProviderOrgInfoComponent implements OnInit {
  readonly constants: typeof Constants = Constants;
  readonly providerType: typeof ProviderType = ProviderType;
  readonly ownershipType: typeof OwnershipType = OwnershipType;
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly providerTypeUkr = ProviderTypeUkr;
  readonly createProviderSteps = createProviderSteps;
  editLink: string = createProviderSteps[0];

  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  currentStatus: string;
  constructor(private store: Store) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {}

  ActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }

}
