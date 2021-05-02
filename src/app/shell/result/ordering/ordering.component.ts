import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Option } from '../result.component';
@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})

export class OrderingComponent {
  // @Input() options: Option[];
  // @Input() selectedOption: Option;
  // @Output() onChange = new EventEmitter<string>();
  // @Select(state => state.filter.order) order$: Observable<any>;

  options: Option[] = [
    { value: 'ratingDesc', viewValue: 'Рейтинг', arrow: 'arrow_downward' },
    { value: 'ratingAsc', viewValue: 'Рейтинг', arrow: 'arrow_upward' },
    { value: 'priceDesc', viewValue: 'Ціна', arrow: 'arrow_downward' },
    { value: 'priceAsc', viewValue: 'Ціна', arrow: 'arrow_upward' }
  ];
  selectedOption: Option = this.options[0];

  visible: boolean = false;

  ngOnInit(): void {

    // this.order$.subscribe(order => {
    //   this.selectedOption = this.options.find(option => option.value === order);
    // });
  }
  // toggleOptions() {
  //   this.visible = !this.visible;
  // }

  // selectOrder(id: number) {
  //   this.onChange.emit(this.options[id].value);
  //   this.toggleOptions();
  // }

  // @HostListener('document:click', ['$event']) onClick(event) {
  //   if (!event.target.closest('.ordering-button')) {
  //     this.visible = false;
  //   }
  // }
}
