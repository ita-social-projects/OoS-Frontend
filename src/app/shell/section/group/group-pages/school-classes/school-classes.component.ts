import { Component, OnInit } from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {FilterState} from '../../../../../shared/store/filter.state';
import {Observable} from 'rxjs';
import {orgCard} from '../../../../../shared/models/org-card.model';
import {ChangePage} from '../../../../../shared/store/app.actions';
import {getPopCards, GetTeachersCards} from '../../../../../shared/store/filter.actions';

@Component({
  selector: 'app-school-classes',
  templateUrl: './school-classes.component.html',
  styleUrls: ['./school-classes.component.scss']
})
export class SchoolClassesComponent implements OnInit {

  @Select(FilterState.orgCards) orgCards$: Observable<orgCard[]>;

  public cards: orgCard[];

  constructor(private store: Store) { }

  ngOnInit(): void {

    this.store.dispatch(new getPopCards());
    this.orgCards$.subscribe((orgCards: orgCard[]) => this.cards = orgCards);

  }

}
