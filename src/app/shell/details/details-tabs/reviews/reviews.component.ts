import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, Select, Store, ofActionCompleted } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'src/app/shared/constants/constants';
import { ReviewDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Role } from 'src/app/shared/enum/role';
import { Parent } from 'src/app/shared/models/parent.model';
import { Rate } from 'src/app/shared/models/rating';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ClearRatings, GetRateByEntityId } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateRating, GetReviewedApplications, GetStatusAllowedToReview, OnCreateRatingSuccess } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  readonly noResultReviews= NoResultsTitle.noReviews;
  readonly Role: typeof Role = Role;
  readonly ReviewDeclination = ReviewDeclination;

  @Input() workshop: Workshop;
  @Input() role: string;

  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  @Select(UserState.isAllowedToReview)
  isAllowedToReview$: Observable<boolean>;
  @Select(UserState.isReviewed)
  isReviewed$: Observable<boolean>;

  @Select(MetaDataState.rating)
  rating$: Observable<Rate[]>;
  rating: Rate[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  parent: Parent;
  isAllowedToReview: boolean;
  isReviewed: boolean;

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private actions$: Actions,
  ) { }

  ngOnInit(): void {
    this.getParentData();
    this.getWorkshopRatingList();

    this.actions$.pipe(ofActionCompleted(OnCreateRatingSuccess))
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged())
      .subscribe(() => this.store.dispatch([new GetRateByEntityId('workshop', this.workshop.id), new GetReviewedApplications(this.parent.id, this.workshop.id)]));

    this.isAllowedToReview$
    .pipe(takeUntil(this.destroy$))
    .subscribe((status: boolean) => (this.isAllowedToReview = status));

    this.isReviewed$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((status: boolean) => (this.isReviewed = status));
  }

  private getParentData(): void {
    this.parent$.pipe(
      filter((parent: Parent) => !!parent),
      takeUntil(this.destroy$)
    ).subscribe((parent: Parent) => {
      this.parent = parent;
      this.store.dispatch([
        new GetStatusAllowedToReview(this.parent.id, this.workshop.id),
        new GetReviewedApplications(this.parent.id, this.workshop.id)
      ]);
    });
  }

  private getWorkshopRatingList(): void {
    this.rating$
      .pipe(
        filter((rating: Rate[]) => !!rating?.length),
        takeUntil(this.destroy$),
      ).subscribe((rating: Rate[]) => {
        this.rating = rating;
      });
  }

  onRate(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.rate,
      }
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result) {
        this.store.dispatch(new CreateRating({
          rate: result,
          type: Constants.WORKSHOP_ENTITY_TYPE,
          entityId: `${this.workshop.id}`,
          parentId: this.parent.id,
        }));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new ClearRatings());
  }
}
