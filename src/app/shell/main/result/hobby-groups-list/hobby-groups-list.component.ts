import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-hobby-groups-list',
  templateUrl: './hobby-groups-list.component.html',
  styleUrls: ['./hobby-groups-list.component.scss']
})
export class HobbyGroupsListComponent implements OnInit {
  stateCards: Observable<Object[]>;
  public cards: Array<Object> = [];

  constructor(private store: Store) {
    this.stateCards = this.store.select(state => state.ShowData);
    // To do: change "state.ShowData" when state will be configured
  }
  
  ngOnInit(): void {
    this.stateCards.subscribe((data) => this.cards = data);
  }

}
