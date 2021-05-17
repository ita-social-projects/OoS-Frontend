import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetWorkshopsById } from 'src/app/shared/store/user.actions';
import { Workshop } from '../../../shared/models/workshop.model';
import { ChangePage } from '../../../shared/store/app.actions';
import { UserState } from '../../../shared/store/user.state';

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss']
})
export class WorkshopsComponent implements OnInit {

  @Select(UserState.workshops)
  workshops$: Observable<Workshop[]>;

  id: null;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.store.dispatch(new GetWorkshopsById(this.id));
    this.workshops$.subscribe(val => console.log(val))
  }

}
