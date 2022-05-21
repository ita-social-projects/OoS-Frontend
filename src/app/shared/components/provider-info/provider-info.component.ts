import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivateEditMode } from 'src/app/shared/store/app.actions';

import {
  createProviderSteps,
  OwnershipType,
  OwnershipTypeUkr,
  ProviderType,
  ProviderTypeUkr,
} from '../../enum/provider';
import { Provider } from '../../models/provider.model';
import { Store } from '@ngxs/store';

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
  @Input() institutionStatuses;
  @Output() tabChanged = new EventEmitter();

  currentStatus: string;

  constructor(private store: Store) {}

  ngOnInit(): void {}

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabChanged.emit(tabChangeEvent);
  }

  ActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }
}
