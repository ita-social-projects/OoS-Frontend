import { Component, Inject, Input, OnInit } from '@angular/core';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { ProviderState } from 'shared/store/provider.state';
import { filter, Observable, Subject } from 'rxjs';
import { SearchResponse } from 'shared/models/search.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { MatDialog } from '@angular/material/dialog';
import { WINDOW } from 'ngx-window-token';
import {
  DeleteCompetitionDraftById,
  GetProviderViewCompetitionDrafts,
  OnDraftSendForModerationSuccess
} from 'shared/store/provider.actions';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Util } from 'shared/utils/utils';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Role } from 'shared/enum/role';
import { CompetitionCardParameters, CompetitionDraftCard } from 'shared/models/competition.model';
import { Provider } from 'shared/models/provider.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-competition-drafts',
  templateUrl: './competition-drafts.component.html',
  styleUrl: './competition-drafts.component.scss'
})
export class CompetitionDraftsComponent implements OnInit {
  @Input() public role: Role;
  @Input() public isLoading$: Observable<boolean>;
  @Input() public provider: Provider;
  @Select(ProviderState.providerCompetitionDrafts)
  public competitionDrafts$: Observable<SearchResponse<CompetitionDraftCard[]>>;

  public readonly constants: typeof Constants = Constants;
  public readonly ModeConstants = ModeConstants;

  public competitionDrafts: SearchResponse<CompetitionDraftCard[]>;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public competitionCardParameters: CompetitionCardParameters = {
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
    this.competitionCardParameters.providerId = this.provider.id;
    this.getProviderDrafts();
    this.competitionDrafts$.pipe(takeUntil(this.destroy$)).subscribe((competitionDrafts: SearchResponse<CompetitionDraftCard[]>) => {
      this.competitionDrafts = competitionDrafts;
    });
    this.actions$.pipe(ofAction(OnDraftSendForModerationSuccess), takeUntil(this.destroy$)).subscribe(() => this.getProviderDrafts());
  }

  /**
   * This method delete workshop By Workshop Id
   * @param competition
   */
  public onDelete(competition: CompetitionDraftCard): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.delete,
        property: competition.title
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(new DeleteCompetitionDraftById(competition, this.competitionCardParameters));
      });
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getProviderDrafts();
    Util.scrollToTop(this.window);
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.competitionCardParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public trackByDraft(index: number, item: CompetitionDraftCard): string {
    return item.competitiveEventDraftId;
  }

  public onTabChange(event: MatTabChangeEvent): void {
    return;
  }

  private getProviderDrafts(): void {
    Util.setFromPaginationParam(this.competitionCardParameters, this.currentPage, this.competitionDrafts?.totalAmount);
    if (this.role === Role.provider || this.role === Role.providerDeputy) {
      this.store.dispatch(new GetProviderViewCompetitionDrafts(this.competitionCardParameters));
    }
  }
}
