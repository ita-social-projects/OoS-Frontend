import { Provider } from 'src/app/shared/models/provider.model';
import { Component, OnInit } from '@angular/core';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { GetAllProviders } from 'src/app/shared/store/admin.actions';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  displayedColumns = [
    'title',
    'ownership',
    'edrpouIpn',
    'licence',
    'city',
    'address',
    'director',
    'status',
    'star',
  ];

  constructor(private store: Store, public providerService: ProviderService) {}

  @Select(AdminState.providers)
  providers: Observable<Provider[]>;

  ngOnInit(): void {
    this.store.dispatch(new GetAllProviders());
    console.log('providers', this.providers);
  }
}
