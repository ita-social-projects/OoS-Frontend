import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { CabinetDataComponent } from '../shared-cabinet/cabinet-data.component';
import { Provider } from 'src/app/shared/models/provider.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-provider',
  template: '',
})
export abstract class ProviderComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  provider: Provider;

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  protected abstract initProviderData(): void;

  /**
   * This method subscribe on provider and get its workshops
   */
  init(): void {
    this.provider$
      .pipe(
        filter((provider: Provider) => !!provider),
        takeUntil(this.destroy$)
      )
      .subscribe((provider: Provider) => {
        this.provider = provider;
        this.initProviderData();
      });
  }
}
