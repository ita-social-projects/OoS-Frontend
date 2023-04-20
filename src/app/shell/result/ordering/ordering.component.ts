import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Ordering } from '../../../shared/enum/ordering';
import { FilterList } from '../../../shared/models/filterList.model';
import { SetOrder } from '../../../shared/store/filter.actions';
import { FilterState } from '../../../shared/store/filter.state';

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})
export class OrderingComponent implements OnInit, OnDestroy {
  readonly ordering = Ordering;

  @Select(FilterState.filterList)
  filterList$: Observable<FilterList>;

  orderFormControl = new FormControl();
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.filterList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => this.orderFormControl.setValue(filters.order, { emitEvent: false }));
  }

  OnSelectOption(event: MatSelectChange): void {
    this.store.dispatch(new SetOrder(event.value));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
