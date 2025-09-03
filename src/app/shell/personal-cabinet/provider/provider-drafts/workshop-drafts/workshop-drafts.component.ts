import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { ProviderState } from 'shared/store/provider.state';
import { filter, Observable, Subject } from 'rxjs';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCardParameters, WorkshopDraftCard } from 'shared/models/workshop.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { MatDialog } from '@angular/material/dialog';
import { WINDOW } from 'ngx-window-token';
import {
  DeleteWorkshopDraftById,
  GetProviderViewWorkshopDrafts,
  GetUnfinishedWorkshop,
  OnDraftSendForModerationSuccess
} from 'shared/store/provider.actions';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Util } from 'shared/utils/utils';
import { Role } from 'shared/enum/role';
import { Provider } from 'shared/models/provider.model';
import { takeUntil } from 'rxjs/operators';
import { BannerMode } from 'shared/enum/bannerMode';
import { FormControl } from '@angular/forms';
import { WorkshopType } from 'shared/enum/workshop';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';

@Component({
  selector: 'app-workshop-drafts',
  templateUrl: './workshop-drafts.component.html',
  styleUrls: ['./workshop-drafts.component.scss']
})
export class WorkshopDraftsComponent implements OnInit, OnDestroy {
  @Input() public role: Role;
  @Input() public isLoading$: Observable<boolean>;
  @Input() public provider: Provider;
  @Select(ProviderState.providerWorkshopDrafts)
  public workshopDrafts$: Observable<SearchResponse<WorkshopDraftCard[]>>;
  @Select(ProviderState.hasUnfinishedWorkshopData)
  public hasUnfinishedWorkshopData$: Observable<boolean>;
  @Select(ProviderState.getTimeToLiveUnfinishedWorkshop)
  public draftLiveTime$: Observable<string>;
  public isLoaded: boolean = false;

  public readonly BannerMode = BannerMode;
  public readonly constants: typeof Constants = Constants;
  public readonly ModeConstants = ModeConstants;
  public readonly WorkshopType = WorkshopType;
  public readonly NoResultsTitle = NoResultsTitle;

  public workshopDrafts: SearchResponse<WorkshopDraftCard[]>;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public workshopCardParameters: WorkshopCardParameters = {
    providerId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private actions$: Actions,
    @Inject(WINDOW) private window: Window
  ) {}

  public ngOnInit(): void {
    this.workshopCardParameters.providerId = this.provider.id;
    this.getProviderDrafts();
    this.workshopDrafts$.pipe(takeUntil(this.destroy$)).subscribe((workshopDrafts: SearchResponse<WorkshopDraftCard[]>) => {
      this.workshopDrafts = workshopDrafts;
    });
    this.actions$.pipe(ofAction(OnDraftSendForModerationSuccess), takeUntil(this.destroy$)).subscribe(() => this.getProviderDrafts());
    this.store.dispatch(new GetUnfinishedWorkshop());
    this.draftLiveTime$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isLoaded = true;
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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

  public onSearch(searchFormControl: FormControl): void {
    const searchText = searchFormControl.value;

    this.workshopCardParameters = {
      ...this.workshopCardParameters,
      searchText
    };

    this.getProviderDrafts();
  }

  private getProviderDrafts(): void {
    Util.setFromPaginationParam(this.workshopCardParameters, this.currentPage, this.workshopDrafts?.totalAmount);
    if (this.role === Role.provider || this.role === Role.providerDeputy) {
      this.store.dispatch(new GetProviderViewWorkshopDrafts(this.workshopCardParameters));
    }
  }
}
