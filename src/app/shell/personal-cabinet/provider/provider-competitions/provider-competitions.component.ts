import { SearchResponse } from 'shared/models/search.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { CompetitionBaseCard, CompetitionCardParameters, CompetitionProviderViewCard } from 'shared/models/competition.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { PushNavPath } from 'shared/store/navigation.actions';
import { Util } from 'shared/utils/utils';
import { MatDialog } from '@angular/material/dialog';
import { ProviderState } from 'shared/store/provider.state';
import { filter, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArchiveCompetitionById, GetProviderViewCompetitions } from 'shared/store/provider.actions';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { FormControl } from '@angular/forms';
import { WorkshopType } from 'shared/enum/workshop';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-competitions',
  templateUrl: './provider-competitions.component.html',
  styleUrls: ['./provider-competitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProviderCompetitionsComponent extends ProviderComponent implements OnInit, OnDestroy {
  @Select(ProviderState.providerCompetitions)
  public competitions$: Observable<SearchResponse<CompetitionProviderViewCard[]>>;

  public readonly ModeConstants = ModeConstants;
  public readonly WorkshopType = WorkshopType;
  public readonly NoResultsTitle = NoResultsTitle;
  public currentPage: PaginationElement = { ...PaginationConstants.firstPage };
  public competitions: SearchResponse<CompetitionProviderViewCard[]>;

  public competitionCardParameters: CompetitionCardParameters = {
    providerId: '',
    size: PaginationConstants.COMPETITIONS_PER_PAGE
  };

  constructor(
    protected readonly store: Store,
    protected matDialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    super(store, matDialog);
  }

  /**
   * This method set navigation path
   */
  public addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Competition,
        isActive: false,
        disable: true
      })
    );
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getProviderCompetitions();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.competitionCardParameters.size = itemsPerPage;
    this.onPageChange({ ...PaginationConstants.firstPage });
  }

  /**
   * This method delete competition By Competition Id
   * @param competition
   */
  public onDelete(competition: CompetitionBaseCard): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.archiveCompetition,
        property: competition.title
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(new ArchiveCompetitionById(competition.id, this.competitionCardParameters));
      });
  }

  public initProviderData(): void {
    this.competitionCardParameters.providerId = this.provider.id;
    this.getProviderCompetitions();

    this.competitions$.pipe(takeUntil(this.destroy$)).subscribe((competitions: SearchResponse<CompetitionProviderViewCard[]>) => {
      this.competitions = competitions;
      this.cdr.markForCheck();
    });
  }

  public onSearch(searchFormControl: FormControl): void {
    const searchText = searchFormControl.value;

    this.competitionCardParameters = {
      ...this.competitionCardParameters,
      searchText
    };

    this.getProviderCompetitions();
  }

  public trackById(index: number, item: CompetitionProviderViewCard): string {
    return item.id;
  }

  /**
   * @private
   * @memberof ProviderCompetitionsComponent
   */
  private getProviderCompetitions(): void {
    Util.setFromPaginationParam(this.competitionCardParameters, this.currentPage, this.competitions?.totalAmount);
    if (this.role === this.Role.provider || this.role === this.Role.providerDeputy) {
      this.store.dispatch(new GetProviderViewCompetitions(this.competitionCardParameters));
    }
  }
}
