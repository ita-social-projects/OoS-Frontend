import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Option } from '../result.component';
@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})

export class OrderingComponent {

  options: Option[] = [
    { value: 'ratingDesc', viewValue: 'Рейтинг', arrow: 'arrow_downward' },
    { value: 'ratingAsc', viewValue: 'Рейтинг', arrow: 'arrow_upward' },
    { value: 'priceDesc', viewValue: 'Ціна', arrow: 'arrow_downward' },
    { value: 'priceAsc', viewValue: 'Ціна', arrow: 'arrow_upward' }
  ];
  selectedOption: Option = this.options[0];
  visible: boolean = false;

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  OnSelectOption(event) {
    this.selectedOption = event.value;
  }
}
