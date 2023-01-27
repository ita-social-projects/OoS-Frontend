import { ParentState } from '../../../../shared/store/parent.state.';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { PaginationConstants, Constants } from '../../../../shared/constants/constants';
import { ReviewDeclination } from '../../../../shared/enum/enumUA/declinations/declination';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NoResultsTitle } from '../../../../shared/enum/enumUA/no-results';
import { Role, EntityType } from '../../../../shared/enum/role';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { Parent } from '../../../../shared/models/parent.model';
import { Rate } from '../../../../shared/models/rating';
import { Workshop } from '../../../../shared/models/workshop.model';
import { GetRateByEntityId, ClearRatings } from '../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../shared/store/meta-data.state';
import { SetRatingPerPage, OnPageChangeRating } from '../../../../shared/store/paginator.actions';
import { PaginatorState } from '../../../../shared/store/paginator.state';
import { OnCreateRatingSuccess, GetReviewedStatus, GetStatusAllowedToReview, CreateRating } from '../../../../shared/store/parent.actions';
import { RegistrationState } from '../../../../shared/store/registration.state';
import { TranslateService } from '@ngx-translate/core';
import { SearchResponse } from '../../../../shared/models/search.model';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  readonly noResultReviews = NoResultsTitle.noReviews;
  readonly Role: typeof Role = Role;
  readonly ReviewDeclination = ReviewDeclination;

  @Input() workshop: Workshop;
  @Input() role: string;

  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  @Select(ParentState.isAllowedToReview)
  isAllowedToReview$: Observable<boolean>;
  @Select(ParentState.isReviewed)
  isReviewed$: Observable<boolean>;

  @Select(MetaDataState.isLoading)
  isLoading$: Observable<boolean>;
  @Select(MetaDataState.rating)
  rating$: Observable<SearchResponse<Rate[]>>;
  rating: SearchResponse<Rate[]>;
  @Select(PaginatorState.ratingPerPage)
  ratingPerPage$: Observable<number>;
  ratingPerPage: number;

  destroy$: Subject<boolean> = new Subject<boolean>();

  parent: Parent;
  isAllowedToReview: boolean;
  isReviewed: boolean;
  currentPage: PaginationElement = PaginationConstants.firstPage;
  alreadyRated: string = this.translateService.instant(' YOU_HAVE_ALREADY_RATED_THIS_WORKSHOP');
  mustBeAccepted: string = this.translateService.instant('YOU_MUST_BE_ACCEPTED_TO_THIS_WORKSHOP');

  constructor(private store: Store, private matDialog: MatDialog, private actions$: Actions, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.getParentData();
    this.getWorkshopRatingList();

    this.actions$
      .pipe(ofActionCompleted(OnCreateRatingSuccess))
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() =>
        this.store.dispatch([
          new GetRateByEntityId(EntityType.workshop, this.workshop.id),
          new GetReviewedStatus(this.parent.id, this.workshop.id)
        ])
      );

    this.isAllowedToReview$.pipe(takeUntil(this.destroy$)).subscribe((status: boolean) => (this.isAllowedToReview = status));

    this.isReviewed$.pipe(takeUntil(this.destroy$)).subscribe((status: boolean) => (this.isReviewed = status));

    this.ratingPerPage$.pipe(takeUntil(this.destroy$)).subscribe((ratingPerPage: number) => (this.ratingPerPage = ratingPerPage));
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

  onRate(): void {
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

  itemsPerPageChange(itemsPerPage: number): void {
    this.ratingPerPage = itemsPerPage;
    this.store.dispatch([new SetRatingPerPage(itemsPerPage), new GetRateByEntityId(EntityType.workshop, this.workshop.id)]);
  }

  pageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeRating(page), new GetRateByEntityId(EntityType.workshop, this.workshop.id)]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new ClearRatings());
  }
}
