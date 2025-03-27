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
import { MetaDataState } from 'shared/store/meta-data.state';
import { FeaturesList } from 'shared/models/features-list.model';
import { ViewportScroller } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.isAuthorizationLoading)
  public isAuthorizationLoading$: Observable<boolean>;
  @Select(MetaDataState.featuresList)
  public featuresList$: Observable<FeaturesList>;

  public isMobileView: boolean;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private previousMobileScreenValue: boolean;
  private selectedLanguage: string;
  private readonly ignoreScrollToTopRoutes = ['/result'];
  private OnlyUkrainianLanguage: boolean = false;

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
    this.store.dispatch([new CheckAuth(), new GetFeaturesList()]);
    this.setLocale();
    this.router.canceledNavigationResolution = 'computed';
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
    this.setLanguageInServices();
  }

  private getLanguage(): void {
    this.getOnlyUkrainianLanguage();
    this.selectedLanguage = localStorage.getItem('ui-culture');
    if (!this.selectedLanguage || this.OnlyUkrainianLanguage) {
      this.setDefaultLanguage();
    }
  }

  private getOnlyUkrainianLanguage(): void {
    this.featuresList$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((featuresList: FeaturesList) => {
      this.OnlyUkrainianLanguage = featuresList.OnlyUkrainianLanguage;
      if (this.OnlyUkrainianLanguage) {
        this.setDefaultLanguage();
        this.setLanguageInServices();
      }
    });
  }

  private setDefaultLanguage(): void {
    this.selectedLanguage = 'uk';
    localStorage.setItem('ui-culture', this.selectedLanguage);
  }

  private setLanguageInServices(): void {
    this.translateService.use(this.selectedLanguage);
    this.dateAdapter.setLocale(this.selectedLanguage);
  }
}
