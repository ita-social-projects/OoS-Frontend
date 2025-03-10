import { SearchResponse } from 'shared/models/search.model';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { CompetitionCardParameters, CompetitionProviderViewCard } from 'shared/models/competition.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { PushNavPath } from 'shared/store/navigation.actions';
import { Util } from 'shared/utils/utils';
import { MatDialog } from '@angular/material/dialog';
import { ProviderState } from 'shared/store/provider.state';
import { filter, Observable, takeUntil } from 'rxjs';
import { DeleteCompetitionById, GetProviderViewCompetitions } from 'shared/store/provider.actions';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-competition',
  templateUrl: './provider-competition.component.html',
  styleUrls: ['./provider-competition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProviderCompetitionComponent extends ProviderComponent implements OnInit, OnDestroy {
  @Select(ProviderState.providerCompetition)
  public competitions$: Observable<SearchResponse<CompetitionCardParameters[]>>;

  public readonly ModeConstants = ModeConstants;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public competitions: SearchResponse<CompetitionCardParameters[]>;

  public competitionCardParameters: CompetitionCardParameters = {
    providerId: '',
    size: PaginationConstants.COMPETITIONS_PER_PAGE
  };

  constructor(
    protected readonly store: Store,
    protected matDialog: MatDialog
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
    this.onPageChange(PaginationConstants.firstPage);
  }

  /**
   * This method delete competition By Competition Id
   * @param competition
   */
  public onDelete(competition: CompetitionProviderViewCard): void {
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
        this.store.dispatch(new DeleteCompetitionById(competition, this.competitionCardParameters));
      });
  }

  public initProviderData(): void {
    this.competitionCardParameters.providerId = this.provider.id;
    this.getProviderCompetitions();

    this.competitions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((competitions: SearchResponse<CompetitionCardParameters[]>) => (this.competitions = competitions));
  }

  private getProviderCompetitions(): void {
    Util.setFromPaginationParam(this.competitionCardParameters, this.currentPage, this.competitions?.totalAmount);
    if (this.role === this.Role.provider || this.role === this.Role.providerDeputy) {
      this.store.dispatch(new GetProviderViewCompetitions(this.competitionCardParameters));
    }
    //  else {
    //   this.store.dispatch(new GetEmployeeWorkshops(this.workshopCardParameters));
    // }
  }
}
