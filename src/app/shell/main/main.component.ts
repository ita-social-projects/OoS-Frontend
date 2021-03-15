import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { orgCard } from 'src/app/shared/models/org-card.model';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { getPopCards } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @Select(FilterState.orgCards) orgCards$: Observable<orgCard[]>;

  public cards: orgCard[];

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(true));
    this.store.dispatch(new getPopCards());
    this.orgCards$.subscribe((orgCards: orgCard[]) => this.cards = orgCards);
    this.store.dispatch(new ChangePage(true));
  }

}
