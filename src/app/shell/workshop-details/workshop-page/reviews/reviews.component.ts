import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'src/app/shared/constants/constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Parent } from 'src/app/shared/models/parent.model';
import { Rate } from 'src/app/shared/models/rating';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { GetRateByEntityId } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { Login } from 'src/app/shared/store/registration.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateRating, OnCreateRatingSuccess } from 'src/app/shared/store/user.actions';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {

  @Input() workshop: Workshop;
  @Input() isRegistered: boolean;
  @Input() isDisplayedforProvider: boolean;


  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  parent: Parent;

  @Select(MetaDataState.rating)
  rating$: Observable<Rate[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private actions$: Actions,) { }

  ngOnInit(): void {
    this.store.dispatch(new GetRateByEntityId('workshop', this.workshop.id));
    this.parent$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((parent: Parent) => this.parent = parent);

    this.actions$.pipe(ofAction(OnCreateRatingSuccess))
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged())
      .subscribe(() => this.store.dispatch(new GetRateByEntityId('workshop', this.workshop.id)));
  }

  onRate(): void {
    this.isRegistered ? this.setWorkshopRating() : this.store.dispatch(new Login());
  }

  private setWorkshopRating(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: {
        type: ModalConfirmationType.rate,
      }
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result) {
        this.store.dispatch(new CreateRating({
          rate: result,
          type: Constants.WORKSHOP_ENTITY_TYPE,
          entityId: this.workshop.id,
          parentId: this.parent.id,
        }));
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
