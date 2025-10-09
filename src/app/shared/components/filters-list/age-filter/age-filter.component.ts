import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';

import { ValidationConstants } from 'shared/constants/validation';
import { AgeFilter } from 'shared/models/filter-list.model';
import { SetIsAppropriateAge, SetMaxAge, SetMinAge, SetNoRestrictionAge } from 'shared/store/filter.actions';
import { Util } from 'shared/utils/utils';
import { AgeRangeValidator } from 'shared/validators/age-range-validator';

@Component({
  selector: 'app-age-filter',
  templateUrl: './age-filter.component.html',
  styleUrls: ['./age-filter.component.scss']
})
export class AgeFilterComponent implements OnInit, OnDestroy {
  public readonly validationConstants = ValidationConstants;

  public minAgeFormControl = new FormControl(null);
  public maxAgeFormControl = new FormControl(null);
  public noRestrictionControl = new FormControl(false);
  public isAppropriateAgeControl = new FormControl(false);
  public ageFormGroup: FormGroup;
  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly store: Store) {}

  @Input()
  public set ageFilter(filter: AgeFilter) {
    const { minAge, maxAge, isAppropriateAge, noAgeRestriction } = filter;
    this.minAgeFormControl.setValue(minAge, { emitEvent: false });
    this.maxAgeFormControl.setValue(maxAge, { emitEvent: false });
    this.noRestrictionControl.setValue(noAgeRestriction, { emitEvent: false });
    this.isAppropriateAgeControl.setValue(isAppropriateAge, { emitEvent: false });
  }

  public ngOnInit(): void {
    this.ageFormGroup = new FormGroup({ startAge: this.minAgeFormControl, endAge: this.maxAgeFormControl });

    this.ageFormGroup.setValidators(AgeRangeValidator());

    this.minAgeFormControl.setValidators([
      Validators.max(this.validationConstants.BIRTH_AGE_MAX),
      Validators.min(this.validationConstants.AGE_MIN)
    ]);

    this.maxAgeFormControl.setValidators([
      Validators.max(this.validationConstants.BIRTH_AGE_MAX),
      Validators.min(this.validationConstants.AGE_MIN)
    ]);

    const formControlDebounceTime = 500;

    this.minAgeFormControl.valueChanges
      .pipe(
        tap((value: number) => this.minAgeFormControl.setValue(Util.formatAgeString(value), { emitEvent: false })),
        debounceTime(formControlDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });

    this.maxAgeFormControl.valueChanges
      .pipe(
        tap((value: number) => this.maxAgeFormControl.setValue(Util.formatAgeString(value), { emitEvent: false })),
        debounceTime(formControlDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });

    this.isAppropriateAgeControl.valueChanges
      .pipe(debounceTime(formControlDebounceTime), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetIsAppropriateAge(val)));

    this.noRestrictionControl.valueChanges
      .pipe(debounceTime(formControlDebounceTime), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: boolean) => {
        if (val) {
          this.minAgeFormControl.setValue(null, { emitEvent: false });
          this.minAgeFormControl.disable();
          this.maxAgeFormControl.setValue(null, { emitEvent: false });
          this.maxAgeFormControl.disable();
        } else {
          this.minAgeFormControl.enable();
          this.maxAgeFormControl.enable();
        }
        this.store.dispatch(new SetNoRestrictionAge(val));
      });
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

  private applyFilters(): void {
    if (!this.ageFormGroup.valid) {
      return;
    }
    if (this.maxAgeFormControl.valid) {
      this.store.dispatch(new SetMaxAge(this.maxAgeFormControl.value || null));
    }
    if (this.minAgeFormControl.valid) {
      this.store.dispatch(new SetMinAge(this.minAgeFormControl.value || null));
    }
  }
}
