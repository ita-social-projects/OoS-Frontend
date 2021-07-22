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
import { UserState } from 'src/app/shared/store/user.state';

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

  constructor(private store: Store, matDialog: MatDialog) { }

  ngOnInit(): void {
    this.store.dispatch(new GetRateByEntityId('workshop', this.workshop.id));
    this.parent$.subscribe((parent: Parent) => this.parent = parent);
  }

  onRate(): void {
    this.store.dispatch(new CreateRating({
      rate: 1,
      type: Constants.WORKSHOP_ENTITY_TYPE,
      entityId: this.workshop.id,
      parentId: this.parent.id
    }))
  }

  /**
  * This method open modal window for rating the workshop
  */
  onCreateRate(): void {
    // const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
    //   width: '330px',
    //   data: 'Видалити гурток?'
    // });

    // dialogRef.afterClosed().subscribe((result: boolean) => {
    //   result && this.store.dispatch(new DeleteWorkshopById(workshop));

    // });
  }
}
