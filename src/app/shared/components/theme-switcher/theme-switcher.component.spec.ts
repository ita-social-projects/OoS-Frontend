import { NgxsModule, Store } from '@ngxs/store';
import { ShowMessageBar } from 'shared/store/app.actions';
import { WINDOW } from 'ngx-window-token';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSwitcherComponent } from './theme-switcher.component';

describe('ThemeSwitcherComponent', () => {
  let component: ThemeSwitcherComponent;
  let fixture: ComponentFixture<ThemeSwitcherComponent>;
  let store: Store;
  let translate: TranslateService;
  let translateInstantSpyOn: jest.SpyInstance;
  let localstorageSetItemSpy: jest.SpyInstance;
  let localstorageGetItemSpy: jest.SpyInstance;

  beforeEach(() => {
    const mockWindow = {
      matchMedia: (query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addListener: jest.fn(),
        removeListener: jest.fn()
      })
    };

    TestBed.configureTestingModule({
      declarations: [ThemeSwitcherComponent],
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot()],
      providers: [{ provide: WINDOW, useValue: mockWindow }]
    });
    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();

    localstorageSetItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    localstorageGetItemSpy = jest.spyOn(Storage.prototype, 'getItem');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit themeSwitched event and show dark theme message when checked is true', () => {
    jest.spyOn(store, 'dispatch');
    jest.spyOn(component.themeSwitched, 'emit');
    translateInstantSpyOn = jest.spyOn(translate, 'instant');
    const checked = true;
    const darkThemeMessage = 'Dark theme activated';

    // Mock translation
    translateInstantSpyOn.mockReturnValue(darkThemeMessage);

    component.onToggleChange({ checked } as MatSlideToggleChange);

    expect(component.themeSwitched.emit).toHaveBeenCalledWith(checked);
    expect(store.dispatch).toHaveBeenCalledWith(
      new ShowMessageBar({ message: darkThemeMessage, type: 'success', infinityDuration: false })
    );
  });

  it('should emit themeSwitched event and show light theme message when checked is false', () => {
    jest.spyOn(store, 'dispatch');
    jest.spyOn(component.themeSwitched, 'emit');
    translateInstantSpyOn = jest.spyOn(translate, 'instant');
    const checked = false;
    const lightThemeMessage = 'Dark theme deactivated';

    // Mock translation
    translateInstantSpyOn.mockReturnValue(lightThemeMessage);

    component.onToggleChange({ checked } as MatSlideToggleChange);

    expect(component.themeSwitched.emit).toHaveBeenCalledWith(checked);
    expect(store.dispatch).toHaveBeenCalledWith(
      new ShowMessageBar({ message: lightThemeMessage, type: 'success', infinityDuration: false })
    );
  });

  it('should dispatch ShowMessageBar action with correct arguments', () => {
    jest.spyOn(store, 'dispatch');
    const message = 'Test message';
    const type = 'success';
    const infinityDuration = true;

    component.showMessage(message, type, infinityDuration);

    expect(store.dispatch).toHaveBeenCalledWith(new ShowMessageBar({ message, type, infinityDuration }));
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
    const event: MatSlideToggleChange = { checked: true, source: null as any };
    component.onToggleChange(event); // Switching to dark mode
    expect(component.isDark).toBe(true);
    expect(localstorageSetItemSpy).toHaveBeenCalledWith('preferred-theme', 'dark');
  });

  it('should set isDark and save theme in localStorage to light when switching mode to light', () => {
    const event: MatSlideToggleChange = { checked: false, source: null as any };
    component.onToggleChange(event); // Switching to light mode
    expect(component.isDark).toBe(false);
    expect(localstorageSetItemSpy).toHaveBeenCalledWith('preferred-theme', 'light');
  });
});
