import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateAdapter } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';

import { NavigationEnd, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: Store;
  let mockMatSnackBar: MatSnackBar;
  let routerEvents$: Subject<any>;
  let viewportScroller: ViewportScroller;

  beforeEach(async () => {
    routerEvents$ = new Subject<any>();

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatProgressBarModule,
        NgxsModule.forRoot([]),
        TranslateModule.forRoot()
      ],
      declarations: [
        AppComponent,
        MockHeaderComponent,
        MockShellComponent,
        MockFooterComponent,
        MockSidenavComponent,
        MockSidenavFilterComponent
      ],
      providers: [
        DateAdapter,
        { provide: Router, useValue: { events: routerEvents$.asObservable() } },
        {
          provide: ViewportScroller,
          useValue: { scrollToPosition: jest.fn() }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    mockMatSnackBar = TestBed.inject(MatSnackBar);
    viewportScroller = TestBed.inject(ViewportScroller);
    fixture.detectChanges();
  });

  afterEach(() => {
    routerEvents$.complete(); // Завершуємо потік подій після кожного тесту
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set isMobileView on resize', () => {
    jest.spyOn(component, 'onResize');

    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    expect(component.onResize).toHaveBeenCalled();
    expect(component.isMobileView).toBeTruthy();
  });

  it('should not scroll to top if routes are in ignore list', () => {
    const previousEvent = new NavigationEnd(1, '/result', '/result');
    const currentEvent = new NavigationEnd(2, '/result', '/result');

    routerEvents$.next(previousEvent);
    routerEvents$.next(currentEvent);

    expect(viewportScroller.scrollToPosition).not.toHaveBeenCalled();
  });

  it('should scroll to top if routes are not in ignore list', () => {
    const previousEvent = new NavigationEnd(1, '/not-ignore', '/not-ignore');
    const currentEvent = new NavigationEnd(2, '/not-ignore', '/not-ignore');

    routerEvents$.next(previousEvent);
    routerEvents$.next(currentEvent);

    expect(viewportScroller.scrollToPosition).toHaveBeenCalledWith([0, 0]);
  });
});

@Component({
  selector: 'app-header',
  template: ''
})
class MockHeaderComponent {
  @Input() isMobileView: boolean;
}

@Component({
  selector: 'app-shell',
  template: ''
})
class MockShellComponent {}

@Component({
  selector: 'app-footer',
  template: ''
})
class MockFooterComponent {}

@Component({
  selector: 'app-sidenav-menu',
  template: ''
})
class MockSidenavComponent {
  @Input() isMobileView: boolean;
}

@Component({
  selector: 'app-sidenav-filters',
  template: ''
})
class MockSidenavFilterComponent {
  @Input() isMobileView: boolean;
}
