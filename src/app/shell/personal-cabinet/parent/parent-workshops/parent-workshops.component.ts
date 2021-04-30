import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { GetParentWorkshops } from 'src/app/shared/store/parent.actions';
import { ParentState } from 'src/app/shared/store/parent.state';


@Component({
  selector: 'app-parent-workshops',
  templateUrl: './parent-workshops.component.html',
  styleUrls: ['./parent-workshops.component.scss']
})
export class ParentWorkshopsComponent implements OnInit {

  @Select(ParentState.parentWorkshops) parentWorkshops$: Observable<Workshop[]>;
  public cards: Workshop[];

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.store.dispatch(new GetParentWorkshops())
    this.parentWorkshops$.subscribe(cards => this.cards = cards);
  }

}
