import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { WINDOW } from 'ngx-window-token';
import { filter, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCardParameters, WorkshopDraftCard } from 'shared/models/workshop.model';
import { PushNavPath } from 'shared/store/navigation.actions';
import { DeleteWorkshopDraftById, GetProviderViewWorkshopDrafts, OnDraftSendForModerationSuccess } from 'shared/store/provider.actions';
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
  @Select(ProviderState.providerDrafts)
  public workshopDrafts$: Observable<SearchResponse<WorkshopDraftCard[]>>;
  @Select(ProviderState.hasUnfinishedWorkshopData)
  public hasUnfinishedWorkshopData$: Observable<boolean>;
  public readonly BannerMode = BannerMode;
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
    protected matDialog: MatDialog,
    private actions$: Actions,
    @Inject(WINDOW) private window: Window
  ) {
    super(store, matDialog);
  }

  /**
   * This method set navigation path
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

  /**
   * This method get provider workshop according to the role
   */
  public initProviderData(): void {
    this.workshopCardParameters.providerId = this.provider.id;
    this.getProviderDrafts();

    this.workshopDrafts$.pipe(takeUntil(this.destroy$)).subscribe((workshopDrafts: SearchResponse<WorkshopDraftCard[]>) => {
      this.workshopDrafts = workshopDrafts;
    });
    this.actions$
      .pipe(ofAction(OnDraftSendForModerationSuccess))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getProviderDrafts());
  }

  /**
   * This method delete workshop By Workshop Id
   * @param workshop
   */
  public onDelete(workshop: WorkshopDraftCard): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.delete,
        property: workshop.title
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(new DeleteWorkshopDraftById(workshop, this.workshopCardParameters));
      });
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getProviderDrafts();
    Util.scrollToTop(this.window);
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.workshopCardParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public trackByDraft(index: number, item: WorkshopDraftCard): string {
    return item.workshopDraftId;
  }

  private getProviderDrafts(): void {
    Util.setFromPaginationParam(this.workshopCardParameters, this.currentPage, this.workshopDrafts?.totalAmount);
    if (this.role === Role.provider || this.role === Role.providerDeputy) {
      this.store.dispatch(new GetProviderViewWorkshopDrafts(this.workshopCardParameters));
    }
  }
}
