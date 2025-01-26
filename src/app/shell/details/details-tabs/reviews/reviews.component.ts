import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Actions, Select, Store, ofActionCompleted } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { ReviewDeclination } from 'shared/enum/enumUA/declinations/declination';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { Parent } from 'shared/models/parent.model';
import { Rate, RateParameters } from 'shared/models/rating';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop } from 'shared/models/workshop.model';
import { ClearRatings, GetRateByEntityId } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import {
  CreateRating,
  DeleteRatingById,
  GetReviewedStatus,
  GetStatusAllowedToReview,
  OnCreateRatingSuccess
} from 'shared/store/parent.actions';
import { ParentState } from 'shared/store/parent.state';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  @Input() public workshop: Workshop;
  @Input() public role: string;

  @Select(RegistrationState.parent)
  public parent$: Observable<Parent>;
  @Select(ParentState.isAllowedToReview)
  public isAllowedToReview$: Observable<boolean>;
  @Select(ParentState.isReviewed)
  public isReviewed$: Observable<boolean>;

  @Select(MetaDataState.isLoading)
  public isLoading$: Observable<boolean>;
  @Select(MetaDataState.rating)
  public rating$: Observable<SearchResponse<Rate[]>>;

  public readonly noResultReviews = NoResultsTitle.noReviews;
  public readonly Role: typeof Role = Role;
  public readonly ReviewDeclination = ReviewDeclination;

  public rating: SearchResponse<Rate[]>;

  public parent: Parent;
  public isAllowedToReview: boolean;
  public isReviewed: boolean;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public rateParameters: RateParameters = {
    entityId: '',
    size: PaginationConstants.RATINGS_PER_PAGE
  };
  public alreadyRated: string = this.translateService.instant('YOU_HAVE_ALREADY_RATED_THIS_WORKSHOP');
  public mustBeAccepted: string = this.translateService.instant('YOU_MUST_BE_ACCEPTED_TO_THIS_WORKSHOP');

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private actions$: Actions,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.rateParameters.entityId = this.workshop.id;
    this.getRates();

    this.getParentData();
    this.getWorkshopRatingList();

    this.actions$
      .pipe(ofActionCompleted(OnCreateRatingSuccess))
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() =>
        this.store.dispatch([new GetRateByEntityId(this.rateParameters), new GetReviewedStatus(this.parent.id, this.workshop.id)])
      );

    this.isAllowedToReview$.pipe(takeUntil(this.destroy$)).subscribe((status: boolean) => (this.isAllowedToReview = status));

    this.isReviewed$.pipe(takeUntil(this.destroy$)).subscribe((status: boolean) => (this.isReviewed = status));
  }

  public onRate(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.rate
      }
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result) {
        this.store.dispatch(
          new CreateRating({
            rate: result,
            type: Constants.WORKSHOP_ENTITY_TYPE,
            entityId: `${this.workshop.id}`,
            parentId: this.parent.id
          })
        );
      }
    });
  }

  public onDelete(rate: Rate): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteRate,
        property: ''
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.store.dispatch(new DeleteRatingById(rate.id)));
  }

  public itemsPerPageChange(itemsPerPage: number): void {
    this.rateParameters.size = itemsPerPage;
    this.pageChange(PaginationConstants.firstPage);
  }

  public pageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getRates();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new ClearRatings());
  }

  private getParentData(): void {
    this.parent$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((parent: Parent) => {
      this.parent = parent;
      this.store.dispatch([
        new GetStatusAllowedToReview(this.parent.id, this.workshop.id),
        new GetReviewedStatus(this.parent.id, this.workshop.id)
      ]);
    });
  }

  private getWorkshopRatingList(): void {
    this.rating$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((rating: SearchResponse<Rate[]>) => (this.rating = rating));
  }

  private getRates(): void {
    Util.setFromPaginationParam(this.rateParameters, this.currentPage, this.rating?.totalAmount);
    this.store.dispatch(new GetRateByEntityId(this.rateParameters));
  }
}
