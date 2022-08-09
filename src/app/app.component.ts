import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { ToggleMobileScreen } from './shared/store/app.actions';
import { FilterState } from './shared/store/filter.state';
import { GetFeaturesList } from './shared/store/meta-data.actions';
import { RegistrationState } from './shared/store/registration.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.isLoading)
  isLoadingUserInfo$: Observable<boolean>;
  @Select(FilterState.isLoading)
  isLoadingResultPage$: Observable<boolean>;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  isMobileView: boolean;
  isLoading: boolean;
  isLoadingData: boolean;

  constructor(public store: Store, private router: Router) {
    this.router.events.subscribe((e: RouterEvent) => this.navigationInterceptor(e));
  }


  /**
   * @param event global variable window
   * method defined window.width and assign isMobileView: boolean
   */

  isWindowMobile(event: any): void {
    this.isMobileView = event.innerWidth <= 750;
    this.store.dispatch(new ToggleMobileScreen(this.isMobileView));
  }

  @HostListener('window: resize', ['$event.target'])
  onResize(event: any): void {
    this.isWindowMobile(event);
  }

  ngOnInit(): void {
    this.isWindowMobile(window);
    this.store.dispatch(new GetFeaturesList());

    combineLatest([this.isLoadingResultPage$, this.isLoadingUserInfo$])
      .pipe(takeUntil(this.destroy$), delay(0))
      .subscribe(([isLoadingResult, isLoadingUserInfo]) => {
        this.isLoadingData = isLoadingResult || isLoadingUserInfo;
      });
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.isLoading = true;
    }
    if (
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
