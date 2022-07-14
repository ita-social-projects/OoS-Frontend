import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';
import { MatDialog } from '@angular/material/dialog';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-org-info',
  templateUrl: './provider-org-info.component.html',
  styleUrls: ['./provider-org-info.component.scss'],
})
export class ProviderOrgInfoComponent extends ProviderComponent implements OnInit, OnDestroy {
  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.ProviderInfo,
        isActive: false,
        disable: true,
      })
    );
  }

  initProviderData(): void {}
}
