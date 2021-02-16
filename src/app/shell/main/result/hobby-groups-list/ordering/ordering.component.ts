import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SetOrder } from 'src/app/shared/store/filter.actions';

interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})
export class OrderingComponent implements OnInit {
  
  @Select(state => state.filter.order) order$: Observable<any>;
  options: Option[] = [
    {value: 'ratingDesc', viewValue: 'Рейтинг'},
    {value: 'ratingAsc', viewValue: 'Рейтинг'},
    {value: 'priceDesc', viewValue: 'Ціна'},
    {value: 'priceAsc', viewValue: 'Ціна'}
  ];
  selectedOption: Option;
  visible: boolean = false;

  constructor(private store: Store) { }

  ngOnInit(): void { 
    this.order$.subscribe(
      order => {
        this.selectedOption = this.options.find(option => option.value === order);
      },
      error => {
        this.selectedOption = this.options[0];
      }
    );
  }

  setOrder(order: string){
    this.store.dispatch(new SetOrder(order));
  }

  toggleOptions(){
    this.visible = !this.visible;
  }

  selectOption(id){
    this.selectedOption = this.options[id];
    this.setOrder(this.selectedOption.value);
    this.toggleOptions();
  }

  @HostListener('document:click', ['$event']) onClick(event) {
    if(!event.target.closest('.ordering-button')) {
      this.visible = false;
    }
  }

}
