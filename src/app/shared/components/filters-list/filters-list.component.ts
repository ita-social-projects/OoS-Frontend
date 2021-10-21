import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SetClosedRecruitment, SetOpenRecruitment, SetWithDisabilityOption } from '../../store/filter.actions';
@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss']
})
export class FiltersListComponent implements OnInit, OnDestroy {

  OpenRecruitmentControl = new FormControl(false);
  ClosedRecruitmentControl = new FormControl(false);
  WithDisabilityOptionControl = new FormControl(false);

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { }

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
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
