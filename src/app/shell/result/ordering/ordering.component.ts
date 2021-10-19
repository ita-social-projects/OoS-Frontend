import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { Ordering } from 'src/app/shared/enum/ordering';
import { SetOrder } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})

export class OrderingComponent implements OnInit, OnDestroy {

  @Select(FilterState.order)
  order$: Observable<string>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  readonly ordering: typeof Ordering = Ordering;

  selectedOption: string = Ordering.rating;
  orderFormControl = new FormControl();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.order$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => this.orderFormControl.setValue(value));

    this.orderFormControl.valueChanges.subscribe(() => this.store.dispatch(new SetOrder(this.selectedOption)))
  }

  OnSelectOption(event: MatSelectChange): void {
    this.selectedOption = event.value;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
