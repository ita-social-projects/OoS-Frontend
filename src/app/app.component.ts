import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, pairwise, Subject } from 'rxjs';

import { ToggleMobileScreen } from 'shared/store/app.actions';
import { GetFeaturesList } from 'shared/store/meta-data.actions';
import { CheckAuth } from 'shared/store/registration.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.isAuthorizationLoading)
  public isAuthorizationLoading$: Observable<boolean>;

  public isMobileView: boolean;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private previousMobileScreenValue: boolean;
  private selectedLanguage: string;
  private readonly ignoreScrollToTopRoutes = ['/result'];

  constructor(
    private store: Store,
    private translateService: TranslateService,
    private dateAdapter: DateAdapter<Date>,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
        pairwise()
      )
      .subscribe(([previousEvent, currentEvent]: [NavigationEnd, NavigationEnd]) => {
        const previousUrl = previousEvent.urlAfterRedirects;
        const currentUrl = currentEvent.urlAfterRedirects;

        if (
          !this.ignoreScrollToTopRoutes.some((route) => previousUrl.includes(route)) ||
          !this.ignoreScrollToTopRoutes.some((route) => currentUrl.includes(route))
        ) {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      });
  }

  @HostListener('window: resize', ['$event.target'])
  public onResize(event: Window): void {
    this.isWindowMobile(event);
  }

  public ngOnInit(): void {
    this.setLocale();
    this.router.canceledNavigationResolution = 'computed';
    this.store.dispatch([new CheckAuth(), new GetFeaturesList()]);
    this.isWindowMobile(window);
  }

  /**
   * @param event global variable window
   * method defined window.width and assign isMobileView: boolean
   */
  public isWindowMobile(event: Window): void {
    this.isMobileView = event.innerWidth < 800;
    if (this.previousMobileScreenValue !== this.isMobileView) {
      this.store.dispatch(new ToggleMobileScreen(this.isMobileView));
      this.previousMobileScreenValue = this.isMobileView;
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private setLocale(): void {
    this.getLanguage();
    this.translateService.use(this.selectedLanguage);
    this.dateAdapter.setLocale(this.selectedLanguage);
  }

  private getLanguage(): void {
    this.selectedLanguage = localStorage.getItem('ui-culture');
    if (!this.selectedLanguage) {
      this.selectedLanguage = 'uk';
      localStorage.setItem('ui-culture', this.selectedLanguage);
    }
  }
}
