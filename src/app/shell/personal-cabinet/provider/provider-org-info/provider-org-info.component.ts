import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { PushNavPath } from '../../../../shared/store/navigation.actions';
import { ProviderComponent } from '../provider.component';
import { Statuses } from '../../../../shared/enum/statuses';

@Component({
  selector: 'app-provider-org-info',
  templateUrl: './provider-org-info.component.html',
  styleUrls: ['./provider-org-info.component.scss']
})
export class ProviderOrgInfoComponent extends ProviderComponent implements OnInit, OnDestroy {
  providerStatus: { status: Statuses; statusReason: string };

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.ProviderInfo,
        isActive: false,
        disable: true
      })
    );
  }

  initProviderData(): void {
    this.providerStatus = { status: this.provider.status, statusReason: this.provider.statusReason };
  }
}
