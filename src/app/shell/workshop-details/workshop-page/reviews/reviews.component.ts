import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'src/app/shared/constants/constants';
import { Parent } from 'src/app/shared/models/parent.model';
import { Rate } from 'src/app/shared/models/rating';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { GetRateByEntityId } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateRating } from 'src/app/shared/store/user.actions';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  @Input() workshop: Workshop;

  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  parent: Parent;

  @Select(MetaDataState.rating)
  rating$: Observable<Rate[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  hasRate: boolean;

  rates = [{
    author: 's',
    rate: 5,
    date: new Date()
  },
  {
    author: 'sa',
    rate: 4,
    date: new Date()
  }]

  constructor(private store: Store, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.store.dispatch(new GetRateByEntityId('workshop', this.workshop.id));
    this.parent$.subscribe((parent: Parent) => this.parent = parent);

    this.rating$.subscribe((rating: Rate[]) => {
      if (rating) {
        this.hasRate = rating.some((rate: Rate) => rate.parentId === this.parent.id)
      }
    })
  }

  onRate(): void {

    if (!this.hasRate) {
      this.store.dispatch(new CreateRating({
        rate: 1,
        type: Constants.WORKSHOP_ENTITY_TYPE,
        entityId: this.workshop.id,
        parentId: this.parent.id
      }))
    }
  }
}
