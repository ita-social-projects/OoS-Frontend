import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, Action, Actions, ofAction } from '@ngxs/store';
import { Subject, Observable, of, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, takeUntil } from 'rxjs/operators';
import { FilterChange, FilterReset, SetClosedRecruitment, SetOpenRecruitment, SetWithDisabilityOption } from '../../store/filter.actions';
@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss']
})
export class FiltersListComponent implements OnInit, OnDestroy {
  @Input() resetFilter$: Observable<void>
  OpenRecruitmentControl = new FormControl(false);
  ClosedRecruitmentControl = new FormControl(false);
  WithDisabilityOptionControl = new FormControl(false);

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, private actions$: Actions) { }

  ngOnInit(): void {

    this.OpenRecruitmentControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((val: boolean) => this.store.dispatch(new SetOpenRecruitment(val)));

    this.ClosedRecruitmentControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((val: boolean) => this.store.dispatch(new SetClosedRecruitment(val)));

    this.WithDisabilityOptionControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((val: boolean) => this.store.dispatch(new SetWithDisabilityOption(val)));

    this.resetFilter$
      .pipe(
        takeUntil(this.destroy$)
    ).subscribe(() => {
        this.WithDisabilityOptionControl.reset();
    })

  }

  onFilterReset() {
    this.store.dispatch([new FilterReset(), new FilterChange()])
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
