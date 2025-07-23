import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCardParameters, WorkshopDraftCard } from 'shared/models/workshop.model';
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
  public readonly constants: typeof Constants = Constants;
  public readonly ModeConstants = ModeConstants;

  public workshopDrafts: SearchResponse<WorkshopDraftCard[]>;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public workshopCardParameters: WorkshopCardParameters = {
    providerId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  constructor(
    protected store: Store,
    protected matDialog: MatDialog
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
    return;
  }
}
