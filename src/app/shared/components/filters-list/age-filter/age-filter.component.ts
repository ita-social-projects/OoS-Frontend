import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Constants } from 'src/app/shared/constants/constants';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, takeUntil, skip } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { SetMaxAge, SetMinAge } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-age-filter',
  templateUrl: './age-filter.component.html',
  styleUrls: ['./age-filter.component.scss']
})
export class AgeFilterComponent implements OnInit, OnDestroy {

  // @Select(FilterState.ageFilter)
  // ageFilter$: Observable<any>;


  readonly constants: typeof Constants = Constants;
  @Input()
  set ageFilter(filter) {
    const {minAge,maxAge} = filter
    this.minAgeFormControl.setValue(minAge,{emitEvent: false});
    this.maxAgeFormControl.setValue(maxAge,{emitEvent: false});
  }

  minAgeFormControl = new FormControl('');
  maxAgeFormControl = new FormControl('');
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { }

  ngOnInit(): void {

    this.minAgeFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((age: number) => this.store.dispatch(new SetMinAge(age)));

    this.maxAgeFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((age: number) => this.store.dispatch(new SetMaxAge(age)));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
