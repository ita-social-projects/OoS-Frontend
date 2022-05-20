import { Component, Input, OnInit, Output } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { MatTabChangeEvent } from '@angular/material/tabs';

import {
  createProviderSteps,
  OwnershipType,
  OwnershipTypeUkr,
  ProviderType,
  ProviderTypeUkr,
} from 'src/app/shared/enum/provider';
import { Provider } from '../../models/provider.model';

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

  @Input() provider: Provider;

  editLink: string = createProviderSteps[0];

  constructor() {}

  ngOnInit(): void {}

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.editLink = createProviderSteps[tabChangeEvent.index];
  }
}
