import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';

import { ToggleMobileScreen } from 'shared/store/app.actions';
import { GetFeaturesList } from 'shared/store/meta-data.actions';
import { CheckAuth } from 'shared/store/registration.actions';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private previousMobileScreenValue: boolean;
  private selectedLanguage: string;

  @Select(RegistrationState.isAuthorizationLoading)
  isAuthorizationLoading$: Observable<boolean>;

  isMobileView: boolean;

  constructor(
    public store: Store,
    private translateService: TranslateService,
    private dateAdapter: DateAdapter<Date>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getLanguage();
    this.translateService.use(this.selectedLanguage);
    this.dateAdapter.setLocale(this.selectedLanguage);
    this.router.canceledNavigationResolution = 'computed';
    this.store.dispatch([new CheckAuth(), new GetFeaturesList()]);
    this.isWindowMobile(window);
  }

  /**
   * @param event global variable window
   * method defined window.width and assign isMobileView: boolean
   */
  isWindowMobile(event: Window): void {
    this.isMobileView = event.innerWidth < 750;
    if (this.previousMobileScreenValue !== this.isMobileView) {
      this.store.dispatch(new ToggleMobileScreen(this.isMobileView));
      this.previousMobileScreenValue = this.isMobileView;
    }
  }

  @HostListener('window: resize', ['$event.target'])
  onResize(event: Window): void {
    this.isWindowMobile(event);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getLanguage(): void {
    this.selectedLanguage = localStorage.getItem('ui-culture');
    if (!this.selectedLanguage) {
      this.selectedLanguage = 'uk';
      localStorage.setItem('ui-culture', this.selectedLanguage);
    }
  }
}
