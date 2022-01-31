import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange, MAT_SELECT_CONFIG } from '@angular/material/select';
import { Actions, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { Ordering } from 'src/app/shared/enum/ordering';
import { SetOrder } from 'src/app/shared/store/filter.actions';

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss'],
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'ordering-overlay-panel' },
    },
  ],
})

export class OrderingComponent implements OnInit {

  @Input()
  set order(rating) {
    this.orderFormControl.setValue(rating, {emitEvent: false});
  };

  readonly ordering: typeof Ordering = Ordering;

  selectedOption: string;
  orderFormControl = new FormControl();
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private store: Store) { }

  ngOnInit(): void {

  }

  OnSelectOption(event: MatSelectChange): void {
    this.selectedOption = event.value;
    this.store.dispatch(new SetOrder(this.selectedOption))
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
