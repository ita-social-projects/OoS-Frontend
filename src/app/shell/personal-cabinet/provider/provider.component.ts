import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Provider } from 'shared/models/provider.model';
import { ProviderState } from 'shared/store/provider.state';
import { RegistrationState } from 'shared/store/registration.state';
import { CabinetDataComponent } from '../shared-cabinet/cabinet-data.component';

@Component({
  selector: 'app-provider',
  template: ''
})
export abstract class ProviderComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  provider: Provider;
  @Select(ProviderState.isLoading)
  isLoading$: Observable<boolean>;

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  protected abstract initProviderData(): void;

  /**
   * This method subscribe on provider and get its workshops
   */
  init(): void {
    this.provider$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((provider: Provider) => {
      this.provider = provider;
      this.initProviderData();
    });
  }
}
