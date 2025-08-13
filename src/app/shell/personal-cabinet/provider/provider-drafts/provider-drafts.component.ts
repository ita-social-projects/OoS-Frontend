import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { map, takeUntil } from 'rxjs/operators';

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
  public selectedTab: number;
  private readonly tabs: string[] = ['workshops', 'competitions'];

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(store, matDialog);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.route.queryParams
      .pipe(
        map((params) => params.t),
        takeUntil(this.destroy$)
      )
      .subscribe((t: string | undefined) => {
        this.updateTab(t);
      });
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

  public updateTab(param: string | undefined): void {
    const t = this.tabs.includes(param) ? param : this.tabs[0];
    this.selectedTab = this.tabs.indexOf(t);
    this.updateQueryParams(t);
  }

  public onTabChange(event: MatTabChangeEvent): void {
    this.updateQueryParams(this.tabs[event.index]);
  }

  private updateQueryParams(t: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { t }
    });
  }
}
