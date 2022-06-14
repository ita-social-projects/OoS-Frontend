import { SetWithDisabilityOption } from './../../store/filter.actions';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterChange, FilterClear, SetClosedRecruitment, SetOpenRecruitment } from '../../store/filter.actions';
import { FilterState } from '../../store/filter.state';
import { FiltersSidenavToggle } from '../../store/navigation.actions';
@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss'],
})
export class FiltersListComponent implements OnInit, OnDestroy {
  @Select(FilterState.filterList)
  filterList$: Observable<any>;
  filterList;

  @Input() isMobileView: boolean;

  OpenRecruitmentControl = new FormControl(false);
  ClosedRecruitmentControl = new FormControl(false);
  WithDisabilityOptionControl = new FormControl(false);
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.filterList$.pipe(takeUntil(this.destroy$)).subscribe(filterList => {
      this.filterList = filterList;
      this.WithDisabilityOptionControl.setValue(filterList.withDisabilityOption, { emitEvent: false });
    });

    this.OpenRecruitmentControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetOpenRecruitment(val)));

    this.ClosedRecruitmentControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetClosedRecruitment(val)));

    this.WithDisabilityOptionControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetWithDisabilityOption(val)));
  }

  changeView(): void {
    this.store.dispatch(new FiltersSidenavToggle());
  }

  onFilterReset(): void {
    this.store.dispatch([new FilterClear(), new FilterChange()]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
