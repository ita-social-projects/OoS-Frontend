import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OwnershipType, ProviderType } from 'src/app/shared/enum/provider';
import { Provider } from 'src/app/shared/models/provider.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-provider-org-info',
  templateUrl: './provider-org-info.component.html',
  styleUrls: ['./provider-org-info.component.scss']
})
export class ProviderOrgInfoComponent implements OnInit {

  readonly providerType: typeof ProviderType = ProviderType;
  readonly ownershipType: typeof OwnershipType = OwnershipType;
  providerTypes = ['FOP', 'Social', 'TOV', 'Private', 'EducationalInstitution', 'Other'];
  ownershipTypes = ['State', 'Common', 'Private'];

  @Select(RegistrationState.provider) provider$: Observable<Provider>;


  constructor(private store: Store) { }

  ngOnInit(): void { }

  /**
  * This method return ownership type
  */
  getOwnerShipType(index: number): string {
    return OwnershipType[this.ownershipTypes[index]];
  }

  /**
  * This method return ownership type
  */
  getProviderType(index: number): string {
    return ProviderType[this.providerTypes[index]];
  }
}
