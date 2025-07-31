import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { PushNavPath } from 'shared/store/navigation.actions';
import {
  DeleteWorkshopDraftById,
  GetProviderViewWorkshopDrafts,
  GetUnfinishedWorkshop,
  OnDraftSendForModerationSuccess
} from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';
import { Util } from 'shared/utils/utils';
import { BannerMode } from 'shared/enum/bannerMode';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-drafts',
  templateUrl: './provider-drafts.component.html',
  styleUrls: ['./provider-drafts.component.scss']
})
export class ProviderDraftsComponent extends ProviderComponent implements OnInit, OnDestroy {
  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(store, matDialog);
  }

  /**
   * This method sets navigation path
   */
  public addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Drafts,
        isActive: false,
        disable: true
      })
    );
  }

  public initProviderData(): void {
    return;
  }

  public onTabChange(event: MatTabChangeEvent): void {
    const t = event.index === 0 ? 'workshops' : 'competitions';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { t }
    });
  }
}
