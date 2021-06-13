import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ChangePage, GetWorkshops } from 'src/app/shared/store/app.actions';
import { AppState } from 'src/app/shared/store/app.state';
@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss']
})
export class WorkshopDetailsComponent implements OnInit {

  @Select(AppState.allWorkshops) workshops$: Observable<Workshop[]>;
  workshop: Workshop;

  constructor(private store: Store) {
    this.store.dispatch(new GetWorkshops())
    this.workshops$.subscribe(workshops => {
      this.workshop = workshops[0];
    })
  }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
  }

}
