import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  createProviderSteps,
  OwnershipType,
  OwnershipTypeUkr,
  ProviderType,
  ProviderTypeUkr,
} from '../../enum/provider';
import { Provider } from '../../models/provider.model';
import { Select, Store } from '@ngxs/store';
import { GetInstitutionStatus } from '../../store/meta-data.actions';
import { MetaDataState } from '../../store/meta-data.state';
import { Observable, Subject } from 'rxjs';
import { InstitutionStatus } from '../../models/institutionStatus.model';
import { filter, takeUntil } from 'rxjs/operators';
import { RegistrationState } from '../../store/registration.state';
import { ActivateEditMode } from 'src/app/shared/store/app.actions';

@Component({
  selector: 'app-provider-info',
  templateUrl: './provider-info.component.html',
  styleUrls: ['./provider-info.component.scss'],
})
export class ProviderInfoComponent implements OnInit {
  readonly constants: typeof Constants = Constants;
  readonly createProviderSteps = createProviderSteps;
  readonly providerType: typeof ProviderType = ProviderType;
  readonly ownershipType: typeof OwnershipType = OwnershipType;
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly providerTypeUkr = ProviderTypeUkr;

  editLink: string = createProviderSteps[0];

  @Input() provider: Provider;
  @Output() tabChanged = new EventEmitter();
  @Input() edit: boolean;

  @Select(MetaDataState.institutionStatuses)
  institutionStatuses$: Observable<InstitutionStatus[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentStatus: string;

  constructor(private store: Store) {}

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
            .find((item) => +item.id === provider?.institutionStatusId)
            ?.name.toString() ?? 'Відсутній';
      });
  }

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabChanged.emit(tabChangeEvent);
  }

  ActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }
}
