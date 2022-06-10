import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Ordering } from 'src/app/shared/enum/ordering';
import { SetOrder } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss'],
})
export class OrderingComponent implements OnInit {
  readonly ordering: typeof Ordering = Ordering;

  @Select(FilterState.filterList)
  filterList$: Observable<any>;

  selectedOption: string;
  orderFormControl = new FormControl();
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.filterList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => this.orderFormControl.setValue(filters.order, { emitEvent: false }));
  }

  OnSelectOption(event: MatSelectChange): void {
    this.selectedOption = event.value;
    this.store.dispatch(new SetOrder(this.selectedOption));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
