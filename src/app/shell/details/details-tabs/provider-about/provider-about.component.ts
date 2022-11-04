import { Component, Input, OnInit } from '@angular/core';
import { OwnershipTypeUkr, ProviderTypeUkr } from '../../../../shared/enum/enumUA/provider';
import { Provider } from '../../../../shared/models/provider.model';

@Component({
  selector: 'app-provider-about',
  templateUrl: './provider-about.component.html',
  styleUrls: ['./provider-about.component.scss']
})
export class ProviderAboutComponent implements OnInit {
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly providerTypeUkr = ProviderTypeUkr;

  @Input() provider: Provider;

  constructor() {}

  ngOnInit(): void {}
}
