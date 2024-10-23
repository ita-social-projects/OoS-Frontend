import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { ValidationConstants } from 'shared/constants/validation';
import { AgeFilter } from 'shared/models/filter-list.model';
import { SetIsAppropriateAge, SetMaxAge, SetMinAge } from 'shared/store/filter.actions';

@Component({
  selector: 'app-age-filter',
  templateUrl: './age-filter.component.html',
  styleUrls: ['./age-filter.component.scss']
})
export class AgeFilterComponent implements OnInit, OnDestroy {
  public readonly validationConstants = ValidationConstants;

  public minAgeFormControl = new FormControl(null);
  public maxAgeFormControl = new FormControl(null);
  public isAppropriateAgeControl = new FormControl(false);
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  @Input()
  public set ageFilter(filter: AgeFilter) {
    const { minAge, maxAge, isAppropriateAge } = filter;
    this.minAgeFormControl.setValue(minAge, { emitEvent: false });
    this.maxAgeFormControl.setValue(maxAge, { emitEvent: false });
    this.isAppropriateAgeControl.setValue(isAppropriateAge, { emitEvent: false });
  }

  public ngOnInit(): void {
    const formControlDebounceTime = 500;

    this.minAgeFormControl.valueChanges
      .pipe(debounceTime(formControlDebounceTime), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((age: number) => this.store.dispatch(new SetMinAge(age)));
    this.maxAgeFormControl.valueChanges
      .pipe(debounceTime(formControlDebounceTime), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((age: number) => this.store.dispatch(new SetMaxAge(age)));
    this.isAppropriateAgeControl.valueChanges
      .pipe(debounceTime(formControlDebounceTime), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetIsAppropriateAge(val)));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public clearMin(): void {
    this.minAgeFormControl.reset();
  }

  public clearMax(): void {
    this.maxAgeFormControl.reset();
  }
}
