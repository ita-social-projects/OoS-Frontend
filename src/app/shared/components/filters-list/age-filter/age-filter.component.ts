import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Constants } from 'src/app/shared/constants/constants';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SetMaxAge, SetMinAge } from 'src/app/shared/store/filter.actions';
@Component({
  selector: 'app-age-filter',
  templateUrl: './age-filter.component.html',
  styleUrls: ['./age-filter.component.scss']
})
export class AgeFilterComponent implements OnInit, OnDestroy {

  readonly constants: typeof Constants = Constants;

  minAgeFormControl = new FormControl('');
  maxAgeFormControl = new FormControl('');
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.minAgeFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      filter((age: number) => !!age)
    ).subscribe((age: number) => this.store.dispatch(new SetMinAge(age)));

    this.maxAgeFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      filter((age: number) => !!age)
    ).subscribe((age: number) => this.store.dispatch(new SetMaxAge(age)));

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
