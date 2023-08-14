import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

import { AdminState } from 'shared/store/admin.state';
import { FilterState } from 'shared/store/filter.state';
import { MainPageState } from 'shared/store/main-page.state';
import { MetaDataState } from 'shared/store/meta-data.state';
import { ParentState } from 'shared/store/parent.state';
import { ProviderState } from 'shared/store/provider.state';
import { RegistrationState } from 'shared/store/registration.state';
import { SharedUserState } from 'shared/store/shared-user.state';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  @Select(FilterState.isLoading)
  isLoadingResultPage$: Observable<boolean>;
  @Select(SharedUserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(MetaDataState.isLoading)
  isLoadingMetaData$: Observable<boolean>;
  @Select(AdminState.isLoading)
  isLoadingAdminData$: Observable<boolean>;
  @Select(MainPageState.isLoadingData)
  isLoadingMainPage$: Observable<boolean>;
  @Select(ProviderState.isLoading)
  isLoadingProvider$: Observable<boolean>;
  @Select(ParentState.isLoading)
  isLoadingParent$: Observable<boolean>;
  @Select(RegistrationState.isAuthorizationLoading)
  isAuthorizationLoading$: Observable<boolean>;

  isLoadingResultPage: boolean;
  isLoadingCabinet: boolean;
  isLoadingMetaData: boolean;
  isLoadingAdminData: boolean;
  isLoadingNotifications: boolean;
  isLoadingMainPage: boolean;
  isAuthorizationLoading: boolean;
  isLoadingProvider: boolean;
  isLoadingParent: boolean;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  ngOnInit(): void {
    combineLatest([
      this.isLoadingResultPage$,
      this.isLoadingMetaData$,
      this.isLoadingCabinet$,
      this.isLoadingAdminData$,
      this.isLoadingMainPage$,
      this.isAuthorizationLoading$,
      this.isLoadingProvider$,
      this.isLoadingParent$
    ])
      .pipe(takeUntil(this.destroy$), delay(0))
      .subscribe(
        ([
          isLoadingResult,
          isLoadingMeta,
          isLoadingCabinet,
          isLoadingAdminData,
          isLoadingMainPage,
          isAuthorizationLoading,
          isLoadingProvider,
          isLoadingParent
        ]) => {
          this.isLoadingResultPage = isLoadingResult;
          this.isLoadingMetaData = isLoadingMeta;
          this.isLoadingCabinet = isLoadingCabinet;
          this.isLoadingAdminData = isLoadingAdminData;
          this.isLoadingMainPage = isLoadingMainPage;
          this.isAuthorizationLoading = isAuthorizationLoading;
          this.isLoadingProvider = isLoadingProvider;
          this.isLoadingParent = isLoadingParent;
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
