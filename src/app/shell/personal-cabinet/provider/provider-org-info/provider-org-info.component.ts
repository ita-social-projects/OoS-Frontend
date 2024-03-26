import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';

import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { OwnershipTypes } from 'shared/enum/provider';
import { PushNavPath } from 'shared/store/navigation.actions';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-org-info',
  templateUrl: './provider-org-info.component.html',
  styleUrls: ['./provider-org-info.component.scss']
})
export class ProviderOrgInfoComponent extends ProviderComponent implements OnInit, OnDestroy {
  readonly ownershipTypes = OwnershipTypes;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog
  ) {
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

  initProviderData(): void {}
}
