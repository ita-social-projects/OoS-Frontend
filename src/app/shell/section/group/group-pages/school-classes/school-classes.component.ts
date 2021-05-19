import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Workshop } from '../../../../../shared/models/workshop.model';
import { AppState } from 'src/app/shared/store/app.state';
import { GetWorkshops } from 'src/app/shared/store/app.actions';

@Component({
  selector: 'app-school-classes',
  templateUrl: './school-classes.component.html',
})
export class SchoolClassesComponent implements OnInit {

  @Select(AppState.allWorkshops) workshops$: Observable<Workshop[]>;

  public cards: Workshop[];

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshops());
  }
}
