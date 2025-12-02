import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { delay, map, takeUntil } from 'rxjs/operators';

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
  public isLoadingResultPage$: Observable<boolean>;
  @Select(SharedUserState.isLoading)
  public isLoadingCabinet$: Observable<boolean>;
  @Select(MetaDataState.isLoading)
  public isLoadingMetaData$: Observable<boolean>;
  @Select(AdminState.isLoading)
  public isLoadingAdminData$: Observable<boolean>;
  @Select(MainPageState.isLoadingData)
  public isLoadingMainPage$: Observable<boolean>;
  @Select(ProviderState.isLoading)
  public isLoadingProvider$: Observable<boolean>;
  @Select(ParentState.isLoading)
  public isLoadingParent$: Observable<boolean>;
  @Select(RegistrationState.isAuthorizationLoading)
  public isAuthorizationLoading$: Observable<boolean>;

  public isAppLoading$: Observable<boolean>;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public ngOnInit(): void {
    this.isAppLoading$ = combineLatest([
      this.isLoadingResultPage$,
      this.isLoadingMetaData$,
      this.isLoadingCabinet$,
      this.isLoadingAdminData$,
      this.isLoadingMainPage$,
      this.isAuthorizationLoading$,
      this.isLoadingProvider$,
      this.isLoadingParent$
    ]).pipe(
      delay(0),
      map((isLoading: boolean[]) => isLoading.some(Boolean)),
      takeUntil(this.destroy$)
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
