import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { Rate } from 'src/app/shared/models/rating';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { GetRateByEntityId } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  @Input() workshop: Workshop;

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

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetRateByEntityId('workshop', this.workshop.id))
  }

}
