import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SetOrder } from 'src/app/shared/store/filter.actions';
import { orgCard } from 'src/app/shared/models/org-card.model';
import { getCards } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';

export interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-organization-cards-list',
  templateUrl: './organization-cards-list.component.html',
  styleUrls: ['./organization-cards-list.component.scss']
})
export class OrganizationCardsListComponent implements OnInit {

  @Select(FilterState.orgCards) orgCards$: Observable<orgCard[]>;
  @Select(state => state.filter.order) order$: Observable<any>;
  
  public cards: orgCard[];
  options: Option[] = [
    {value: 'ratingDesc', viewValue: 'Рейтинг'},
    {value: 'ratingAsc', viewValue: 'Рейтинг'},
    {value: 'priceDesc', viewValue: 'Ціна'},
    {value: 'priceAsc', viewValue: 'Ціна'}
  ];
  selectedOption: Option;

  constructor(private store: Store) { }
  
  ngOnInit(): void {
    this.store.dispatch(new getCards())
    this.orgCards$.subscribe((orgCards: orgCard[]) => this.cards = orgCards)
    this.order$.subscribe(order => {
      this.selectedOption = this.options.find(option => option.value === order);
    });
  }

  setOrder(order: string){
    this.store.dispatch(new SetOrder(order));
  }

  onChangeOrder(order: string){
    this.setOrder(order);
  }

}
