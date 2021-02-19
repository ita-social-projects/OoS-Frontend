import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SetOrder } from 'src/app/shared/store/filter.actions';

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

  stateCards: Observable<Object[]>;
  public cards: Array<Object> = [];

  @Select(state => state.filter.order) order$: Observable<any>;
  options: Option[] = [
    {value: 'ratingDesc', viewValue: 'Рейтинг'},
    {value: 'ratingAsc', viewValue: 'Рейтинг'},
    {value: 'priceDesc', viewValue: 'Ціна'},
    {value: 'priceAsc', viewValue: 'Ціна'}
  ];
  selectedOption: Option;

  constructor(private store: Store) {
    this.stateCards = this.store.select(state => state.ShowData);
    // To do: change "state.ShowData" when state will be configured
  }
  
  ngOnInit(): void {
    this.stateCards.subscribe(data => this.cards = data);
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
