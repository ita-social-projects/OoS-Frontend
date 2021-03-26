import { Component, OnInit } from '@angular/core';
import { UpdateCurrentView } from '../../shared/result.actions';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SetOrder } from 'src/app/shared/store/filter.actions';
import { ChangePage } from 'src/app/shared/store/app.actions';

export interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  @Select(state => state.filter.order) order$: Observable<any>;
  
  options: Option[] = [
    {value: 'ratingDesc', viewValue: 'Рейтинг'},
    {value: 'ratingAsc', viewValue: 'Рейтинг'},
    {value: 'priceDesc', viewValue: 'Ціна'},
    {value: 'priceAsc', viewValue: 'Ціна'}
  ];
  selectedOption: Option;

  public currentView: string;
  isFiltersVisible: boolean = true;

  constructor(private store: Store) {}
  
  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.currentView ='show-data';
    this.order$.subscribe(order => {
      this.selectedOption = this.options.find(option => option.value === order);
    });
  }

  public SetCurrentView(view: string) {
    this.currentView = view;
    this.store.dispatch(new UpdateCurrentView(view));
    // To do: finish action when state will be configured
  }

  setOrder(order: string) {
    this.store.dispatch(new SetOrder(order));
  }

  onChangeOrder(order: string) {
    this.setOrder(order);
  }

}
