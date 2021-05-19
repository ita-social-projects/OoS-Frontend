import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { GetWorkshops } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss']
})
export class WorkshopDetailsComponent implements OnInit {

  @Select(FilterState.workshopsCards) workshops$: Observable<Workshop[]>;
  workshop: Workshop;

  constructor(private store: Store) {
    this.store.dispatch(new GetWorkshops())
    this.workshops$.subscribe(workshops => {
      this.workshop = workshops[0];
    })
  }

  ngOnInit(): void {
  }

}
