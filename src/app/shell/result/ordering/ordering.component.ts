import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Actions, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { Ordering } from 'src/app/shared/enum/ordering';
import { SetOrder } from 'src/app/shared/store/filter.actions';

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})

export class OrderingComponent implements OnInit {

  @Input() resetFilter$: Observable<void>;
  readonly ordering: typeof Ordering = Ordering;

  selectedOption: string = Ordering.rating;
  orderFormControl = new FormControl();
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private store: Store,private actions$: Actions) { }

  ngOnInit(): void {
    this.resetFilter$.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.orderFormControl.setValue(this.ordering.rating)
      })

    this.orderFormControl.valueChanges.subscribe(() => this.store.dispatch(new SetOrder(this.selectedOption)));
  }

  OnSelectOption(event: MatSelectChange): void {
    this.selectedOption = event.value;
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
