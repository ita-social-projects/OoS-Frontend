import { MainPageState } from 'src/app/shared/store/main-page.state';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { AdminState } from 'src/app/shared/store/admin.state';
import { FilterState } from 'src/app/shared/store/filter.state';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  @Select(FilterState.isLoading)
  isLoadingResultPage$: Observable<boolean>;
  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(MetaDataState.isLoading)
  isLoadingMetaData$: Observable<boolean>;
  @Select(AdminState.isLoading)
  isLoadingAdminData$: Observable<boolean>;
  @Select(MainPageState.isLoadingData)
  isLoadingMainPage$: Observable<boolean>;

  isLoadingResultPage: boolean;
  isLoadingCabinet: boolean;
  isLoadingMetaData: boolean;
  isLoadingAdminData: boolean;
  isLoadingNotifications: boolean;
  isLoadingMainPage: boolean;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  ngOnInit(): void {
    combineLatest([
      this.isLoadingResultPage$,
      this.isLoadingMetaData$,
      this.isLoadingCabinet$,
      this.isLoadingAdminData$,
      this.isLoadingMainPage$
    ])
      .pipe(takeUntil(this.destroy$), delay(0))
      .subscribe(([isLoadingResult, isLoadingMeta, isLoadingCabinet, isLoadingAdminData, isLoadingMainPage]) => {
        this.isLoadingResultPage = isLoadingResult;
        this.isLoadingMetaData = isLoadingMeta;
        this.isLoadingCabinet = isLoadingCabinet;
        this.isLoadingAdminData = isLoadingAdminData;
        this.isLoadingMainPage = isLoadingMainPage;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
