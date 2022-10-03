import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ToggleMobileScreen } from './shared/store/app.actions';
import { GetFeaturesList } from './shared/store/meta-data.actions';
import { CheckAuth } from './shared/store/registration.actions';
import { RegistrationState } from './shared/store/registration.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  @Select(RegistrationState.isAutorizationLoading)
  isAutorizationLoading$: Observable<boolean>;

  isMobileView: boolean;

  constructor(public store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new CheckAuth());
    this.isWindowMobile(window);
    this.store.dispatch(new GetFeaturesList());
  }

  /**
   * @param event global variable window
   * method defined window.width and assign isMobileView: boolean
   */

  isWindowMobile(event: Window): void {
    this.isMobileView = event.innerWidth <= 750;
    this.store.dispatch(new ToggleMobileScreen(this.isMobileView));
  }

  @HostListener('window: resize', ['$event.target'])
  onResize(event: Window): void {
    this.isWindowMobile(event);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
