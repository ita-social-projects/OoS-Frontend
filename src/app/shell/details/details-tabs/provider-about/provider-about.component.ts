import { Component, Input } from '@angular/core';
import { OwnershipTypesEnum, InstitutionTypesEnum } from '../../../../shared/enum/enumUA/provider';
import { Provider } from '../../../../shared/models/provider.model';

@Component({
  selector: 'app-provider-about',
  templateUrl: './provider-about.component.html',
  styleUrls: ['./provider-about.component.scss']
})
export class ProviderAboutComponent {
  readonly ownershipTypesEnum = OwnershipTypesEnum;
  readonly institutionTypesEnum = InstitutionTypesEnum;

  @Input() provider: Provider;
}
