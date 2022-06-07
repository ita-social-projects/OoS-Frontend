import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  CreateProviderSteps,
  InstitutionType,
  OwnershipType,
  OwnershipTypeUkr,
  ProviderType,
  ProviderTypeUkr,
} from '../../enum/provider';
import { Provider } from '../../models/provider.model';
import { Select, Store } from '@ngxs/store';
import { MetaDataState } from '../../store/meta-data.state';
import { Observable, Subject } from 'rxjs';
import { InstitutionStatus } from '../../models/institutionStatus.model';
import { ActivateEditMode } from 'src/app/shared/store/app.actions';

@Component({
  selector: 'app-provider-info',
  templateUrl: './provider-info.component.html',
  styleUrls: ['./provider-info.component.scss'],
})
export class ProviderInfoComponent {
  readonly constants: typeof Constants = Constants;
  readonly providerType: typeof ProviderType = ProviderType;
  readonly ownershipType: typeof OwnershipType = OwnershipType;
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly providerTypeUkr = ProviderTypeUkr;
  readonly institutionType = InstitutionType;
  editLink: string = CreateProviderSteps[0];

  @Input() provider: Provider;
  @Input() isProviderView: boolean;

  @Output() tabChanged = new EventEmitter();
  @Output() closeInfo = new EventEmitter();

  @Select(MetaDataState.institutionStatuses)
  institutionStatuses$: Observable<InstitutionStatus[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentStatus: string;

  constructor(private store: Store) {}

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.editLink = CreateProviderSteps[tabChangeEvent.index];
    this.tabChanged.emit(tabChangeEvent);
  }

  onCloseInfo(): void {
    this.closeInfo.emit();
  }

  onActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }
}
