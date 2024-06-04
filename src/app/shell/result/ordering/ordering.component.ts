import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatLegacySelectChange as MatSelectChange } from '@angular/material/legacy-select';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Ordering } from 'shared/enum/ordering';
import { FilterList } from 'shared/models/filter-list.model';
import { SetOrder } from 'shared/store/filter.actions';
import { FilterState } from 'shared/store/filter.state';

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})
export class OrderingComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Select(FilterState.filterList)
  private filterList$: Observable<FilterList>;

  public readonly Ordering = Ordering;

  public orderFormControl = new FormControl();
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.filterList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => this.orderFormControl.setValue(filters.order, { emitEvent: false }));
  }

  public ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onSelectOption(event: MatSelectChange): void {
    this.store.dispatch(new SetOrder(event.value));
  }
}
