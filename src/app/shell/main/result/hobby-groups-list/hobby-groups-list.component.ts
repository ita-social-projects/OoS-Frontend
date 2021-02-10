import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { orgCard, ORGCARDS } from 'src/app/mock-org-cards';

@Component({
  selector: 'app-hobby-groups-list',
  templateUrl: './hobby-groups-list.component.html',
  styleUrls: ['./hobby-groups-list.component.scss']
})
export class HobbyGroupsListComponent implements OnInit {
  /* stateCards: Observable<Object[]>; */
  public cards: orgCard[];

  constructor(/* private store: Store */) {
    /* this.stateCards = this.store.select(state => state.ShowData); */
    // To do: change "state.ShowData" when state will be configured
  }
  
  ngOnInit(): void {
    /* this.stateCards.subscribe((data) => this.cards = data); */
    this.getCards().subscribe(cards => this.cards = cards);
  }

  getCards(): Observable<orgCard[]> {
    return of(ORGCARDS);
  }

}
