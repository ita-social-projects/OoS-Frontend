import { WorkhopStatus } from './../../enum/workshop';
import { NavigationState } from 'src/app/shared/store/navigation.state';
import { SetWithDisabilityOption } from './../../store/filter.actions';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterChange, FilterClear, SetClosedRecruitment, SetOpenRecruitment } from '../../store/filter.actions';
import { FilterState } from '../../store/filter.state';
import { FiltersSidenavToggle } from '../../store/navigation.actions';
import { Direction } from '../../models/category.model';
@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss'],
})
export class FiltersListComponent implements OnInit, OnDestroy {
  @Select(FilterState.filterList)
  filterList$: Observable<any>;
  filterList: {
    withDisabilityOption: boolean;
    statuses: WorkhopStatus[];
    categoryCheckBox: Direction[],
    ageFilter: { minAge: number, maxAge: number, IsAppropriateAge: boolean },
    priceFilter: {
      minPrice: number,
      maxPrice: number,
      isFree: boolean,
      isPaid: boolean
    },
    workingHours: {
      workingDays: string[],
      startTime: string,
      endTime: string,
      isStrictWorkdays: boolean
      isAppropriateHours: boolean
    },
    order: string
  };

  @Select(NavigationState.filtersSidenavOpenTrue)
  filtersSidenavOpenTrue$: Observable<boolean>;
  visibleFiltersSidenav: boolean;

  @Input() isMobileView: boolean;

  OpenRecruitmentControl = new FormControl(false);
  ClosedRecruitmentControl = new FormControl(false);
  WithDisabilityOptionControl = new FormControl(false);
  destroy$: Subject<boolean> = new Subject<boolean>();
  statuses: WorkhopStatus[];
  readonly workhopStatus = WorkhopStatus;

  constructor(private store: Store) {}

  ngOnInit(): void {
    combineLatest([this.filtersSidenavOpenTrue$, this.filterList$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([visibleFiltersSidenav, filterList]) => {
      this.visibleFiltersSidenav = visibleFiltersSidenav;
      this.filterList = filterList;
      this.statuses = filterList.statuses;
      this.WithDisabilityOptionControl.setValue(filterList.withDisabilityOption, { emitEvent: false });
    });

    this.OpenRecruitmentControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => {
        this.statusHandler(val, this.workhopStatus.Open)
        this.store.dispatch(new SetOpenRecruitment(this.statuses))
      });

    this.ClosedRecruitmentControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => {
        this.statusHandler(val, this.workhopStatus.Closed)
        this.store.dispatch(new SetClosedRecruitment(this.statuses))
      });
      
    this.WithDisabilityOptionControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetWithDisabilityOption(val)));
  }

  statusHandler(val: boolean, status: string): void {
    val ?  
    this.statuses.push(this.workhopStatus[status]) : 
    this.statuses.splice(this.statuses.indexOf(this.workhopStatus[status]), 1); 
  }

  changeView(): void {
    this.store.dispatch(new FiltersSidenavToggle(!this.visibleFiltersSidenav));
  }

  onFilterReset(): void {
    this.store.dispatch([new FilterClear(), new FilterChange()]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
