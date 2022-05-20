import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  createProviderSteps,
  OwnershipType,
  OwnershipTypeUkr,
  ProviderType,
  ProviderTypeUkr,
} from 'src/app/shared/enum/provider';

import { InstitutionStatus } from 'src/app/shared/models/institutionStatus.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { ActivateEditMode } from 'src/app/shared/store/app.actions';
import { GetInstitutionStatus } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
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
  @Select(MetaDataState.institutionStatuses)
  institutionStatuses$: Observable<InstitutionStatus[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  currentStatus: string;
  constructor(private store: Store) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.store.dispatch(new GetInstitutionStatus());
    this.institutionStatuses$
      .pipe(
        filter((institutionStatuses) => !!institutionStatuses.length),
        takeUntil(this.destroy$)
      )
      .subscribe((institutionStatuses) => {
        const provider = this.store.selectSnapshot(RegistrationState.provider);
        this.currentStatus =
          institutionStatuses
            .find((item) => +item.id === provider.institutionStatusId)
            ?.name.toString() ?? 'Відсутній';
      });
  }

  ActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.editLink = createProviderSteps[tabChangeEvent.index];
  }
}
