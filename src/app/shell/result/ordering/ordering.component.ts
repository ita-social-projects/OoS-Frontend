import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngxs/store';
import { Constants } from 'src/app/shared/constants/constants';
import { Ordering } from 'src/app/shared/enum/ordering';
import { SetOrder } from 'src/app/shared/store/filter.actions';
@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})

export class OrderingComponent {

  readonly ordering: typeof Ordering = Ordering;

  selectedOption: string = Ordering.rating;
  orderFormControl = new FormControl();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.orderFormControl.valueChanges.subscribe(() => this.store.dispatch(new SetOrder(this.selectedOption)))
  }

  OnSelectOption(event: MatSelectChange): void {
    this.selectedOption = event.value;
  }
}
