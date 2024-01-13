import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Actions, Select, Store, ofActionDispatched } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { MessageBarComponent } from 'shared/components/message-bar/message-bar.component';
import { MessageBarData } from 'shared/models/message-bar.model';
import { ClearMessageBar, ShowMessageBar, ToggleMobileScreen } from 'shared/store/app.actions';
import { GetFeaturesList } from 'shared/store/meta-data.actions';
import { CheckAuth } from 'shared/store/registration.actions';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.isAuthorizationLoading)
  public isAuthorizationLoading$: Observable<boolean>;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private previousMobileScreenValue: boolean;
  private selectedLanguage: string;
  public isMobileView: boolean;

  constructor(
    private store: Store,
    private actions$: Actions,
    private translateService: TranslateService,
    private dateAdapter: DateAdapter<Date>,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.setLocale();
    this.setSnackBar();
    this.router.canceledNavigationResolution = 'computed';
    this.store.dispatch([new CheckAuth(), new GetFeaturesList()]);
    this.isWindowMobile(window);
  }

  /**
   * @param event global variable window
   * method defined window.width and assign isMobileView: boolean
   */
  public isWindowMobile(event: Window): void {
    this.isMobileView = event.innerWidth < 750;
    if (this.previousMobileScreenValue !== this.isMobileView) {
      this.store.dispatch(new ToggleMobileScreen(this.isMobileView));
      this.previousMobileScreenValue = this.isMobileView;
    }
  }

  @HostListener('window: resize', ['$event.target'])
  public onResize(event: Window): void {
    this.isWindowMobile(event);
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

  private setSnackBar(): void {
    this.actions$
      .pipe(ofActionDispatched(ShowMessageBar), takeUntil(this.destroy$))
      .subscribe((action) => this.showSnackBar(action.payload));
    this.actions$
      .pipe(ofActionDispatched(ClearMessageBar), takeUntil(this.destroy$))
      .subscribe(() => this.snackBar.dismiss());
  }

  private getLanguage(): void {
    this.selectedLanguage = localStorage.getItem('ui-culture');
    if (!this.selectedLanguage) {
      this.selectedLanguage = 'uk';
      localStorage.setItem('ui-culture', this.selectedLanguage);
    }
  }

  private showSnackBar(messageBarData: MessageBarData): void {
    this.snackBar.openFromComponent(MessageBarComponent, {
      duration: messageBarData.infinityDuration ? null : 5000,
      verticalPosition: messageBarData.verticalPosition || 'top',
      horizontalPosition: messageBarData.horizontalPosition || 'center',
      panelClass: messageBarData.type,
      data: messageBarData
    });
  }
}
