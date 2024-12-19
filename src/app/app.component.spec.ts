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

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: Store;
  let mockMatSnackBar: MatSnackBar;
  let localstorageSetItemSpy: jest.SpyInstance;
  let localstorageGetItemSpy: jest.SpyInstance;

  beforeEach(async () => {
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
      providers: [DateAdapter]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    mockMatSnackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();

    localstorageSetItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    localstorageGetItemSpy = jest.spyOn(Storage.prototype, 'getItem');
  });

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
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

  it('should set isDark based on localStorage (when it is "dark")', () => {
    localstorageGetItemSpy.mockReturnValue('dark');
    component.ngOnInit();
    expect(component.isDark).toBe(true);
  });

  it('should set isDark based on localStorage (when it is "light")', () => {
    localstorageGetItemSpy.mockReturnValue('light');
    component.ngOnInit();
    expect(component.isDark).toBe(false);
  });

  it('should set isDark and save theme in localStorage to dark when switching mode to dark', () => {
    component.switchMode(true); // Switching to dark mode
    expect(component.isDark).toBe(true);
    expect(localstorageSetItemSpy).toHaveBeenCalledWith('preferred-theme', 'dark');
  });

  it('should set isDark and save theme in localStorage to light when switching mode to light', () => {
    component.switchMode(false); // Switching to light mode
    expect(component.isDark).toBe(false);
    expect(localstorageSetItemSpy).toHaveBeenCalledWith('preferred-theme', 'light');
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
