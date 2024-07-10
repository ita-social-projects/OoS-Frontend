import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { FormOfLearningEnum } from 'shared/enum/enumUA/workshop';
import { FormOfLearning, WorkshopOpenStatus } from 'shared/enum/workshop';
import { FilterList } from 'shared/models/filter-list.model';
import {
  FilterClear,
  SetClosedRecruitment,
  SetFormsOfLearning,
  SetOpenRecruitment,
  SetWithDisabilityOption
} from 'shared/store/filter.actions';
import { FilterState } from 'shared/store/filter.state';
import { FiltersSidenavToggle } from 'shared/store/navigation.actions';
import { NavigationState } from 'shared/store/navigation.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss']
})
export class FiltersListComponent implements OnInit, OnDestroy {
  @Select(FilterState.filterList)
  public filterList$: Observable<FilterList>;

  @Select(NavigationState.filtersSidenavOpenTrue)
  public filtersSidenavOpenTrue$: Observable<boolean>;

  @Select(FilterState.isMapView)
  public isMapView$: Observable<boolean>;

  @Input() public isMobileView: boolean;

  public readonly workshopStatus = WorkshopOpenStatus;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly Util = Util;

  public formOfLearningControls = {
    Offline: new FormControl(false),
    Online: new FormControl(false),
    Mixed: new FormControl(false)
  };
  public OpenRecruitmentControl = new FormControl(false);
  public ClosedRecruitmentControl = new FormControl(false);
  public WithDisabilityOptionControl = new FormControl(false);

  public filterList: FilterList;
  private visibleFiltersSidenav: boolean;
  private statuses: WorkshopOpenStatus[];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  public ngOnInit(): void {
    combineLatest([this.filtersSidenavOpenTrue$, this.filterList$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([visibleFiltersSidenav, filterList]) => {
        this.visibleFiltersSidenav = visibleFiltersSidenav;
        this.filterList = filterList;
        this.statuses = filterList.statuses;
        this.WithDisabilityOptionControl.setValue(filterList.withDisabilityOption, { emitEvent: false });
      });

    combineLatest(
      Object.values(this.formOfLearningControls).map((formControl) => formControl.valueChanges.pipe(startWith(formControl.value)))
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe((values: boolean[]) => {
        const formsOfLearning = Object.values(FormOfLearning).filter((_, index) => values[index]);
        this.store.dispatch(new SetFormsOfLearning(formsOfLearning));
      });

    this.OpenRecruitmentControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => {
      this.statusHandler(val, this.workshopStatus.Open);
      this.store.dispatch(new SetOpenRecruitment(this.statuses));
    });

    this.ClosedRecruitmentControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => {
      this.statusHandler(val, this.workshopStatus.Closed);
      this.store.dispatch(new SetClosedRecruitment(this.statuses));
    });

    this.WithDisabilityOptionControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetWithDisabilityOption(val)));
  }

  /**
   * When the user selects filters (OpenRecruitment or ClosedRecruitment),
   * we add the status to the array or remove the status from the array.
   */
  public statusHandler(val: boolean, status: string): void {
    if (val) {
      this.statuses.push(this.workshopStatus[status]);
    } else {
      this.statuses.splice(this.statuses.indexOf(this.workshopStatus[status]), 1);
    }
  }

  public changeView(): void {
    this.store.dispatch(new FiltersSidenavToggle(!this.visibleFiltersSidenav));
  }

  public onFilterReset(): void {
    this.store.dispatch(new FilterClear());
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
