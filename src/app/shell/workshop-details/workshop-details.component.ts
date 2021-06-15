import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { GetWorkshopsById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss']
})
export class WorkshopDetailsComponent implements OnInit {

  @Select(UserState.selectedWorkshop) workshop$: Observable<Workshop>;
  workshop: Workshop;

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const workshopId = +this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new ChangePage(false));
    this.store.dispatch(new GetWorkshopsById(workshopId));
  }

}
