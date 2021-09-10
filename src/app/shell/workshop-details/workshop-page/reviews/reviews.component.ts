import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'src/app/shared/constants/constants';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Application } from 'src/app/shared/models/application.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { Rate } from 'src/app/shared/models/rating';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { GetRateByEntityId } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { Login } from 'src/app/shared/store/registration.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateRating, GetApplicationsByParentId, OnCreateRatingSuccess } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {

  @Input() workshop: Workshop;
  @Input() isDisplayedforProvider: boolean;

  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  @Select(UserState.applications)
  applications$: Observable<Application[]>;
  @Select(MetaDataState.rating)
  rating$: Observable<Rate[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  parent: Parent;
  approvedApplications: Application[];
  isRated: boolean = false;
  hasApprovedApplication: boolean = false;

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private actions$: Actions,) { }

  ngOnInit(): void {
    this.getParentData();
    this.getWorkshopRatingList();

    this.actions$.pipe(ofAction(OnCreateRatingSuccess))
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged())
      .subscribe(() => this.store.dispatch(new GetRateByEntityId('workshop', this.workshop.id)));
  }

  private getParentData(): void {
    this.parent$.pipe(
      filter((parent: Parent) => parent !== undefined),
      takeUntil(this.destroy$)
    ).subscribe((parent: Parent) => {
      this.parent = parent;
      this.store.dispatch(new GetApplicationsByParentId(parent.id));
      this.applications$.pipe(
        filter((applications: Application[]) => applications?.length > 0),
        takeUntil(this.destroy$)
      ).subscribe((applications: Application[]) =>
        this.approvedApplications = applications.filter((application: Application) => application.status = ApplicationStatus.Approved))
    });
  }

  private getWorkshopRatingList(): void {
    this.store.dispatch(new GetRateByEntityId('workshop', this.workshop.id));
    this.rating$
      .pipe(
        filter((rating: Rate[]) => rating.length > 0),
        takeUntil(this.destroy$)
      ).subscribe((rating: Rate[]) => {
        rating.some((rate: Rate) => {
          if (this.parent) {
            this.isRated = (rate.parentId === this.parent.id);
            this.hasApprovedApplication = this.approvedApplications?.some((application: Application) => {
              (+rate.entityId === application.workshopId);
            })
          }
        });
      });
  }

  onRate(): void {
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
