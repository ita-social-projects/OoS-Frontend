import { Store } from '@ngxs/store';
import { ShowMessageBar } from 'shared/store/app.actions';
import { WINDOW } from 'ngx-window-token';
import { Renderer2 } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MessageBarType } from 'shared/enum/message-bar';
import { TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSwitcherComponent } from './theme-switcher.component';

describe('ThemeSwitcherComponent', () => {
  let component: ThemeSwitcherComponent;
  let fixture: ComponentFixture<ThemeSwitcherComponent>;
  let mockStore: any;
  let mockTranslateService: any;
  let mockRenderer: any;
  let mockWindow: any;

  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn()
    };

    mockTranslateService = {
      instant: jest.fn().mockImplementation((key: string) => key) // Return key as translation
    };

    mockRenderer = {
      addClass: jest.fn(),
      removeClass: jest.fn()
    };

    mockWindow = {
      matchMedia: jest.fn().mockReturnValue({ matches: true })
    };

    TestBed.configureTestingModule({
      declarations: [ThemeSwitcherComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: Renderer2, useValue: mockRenderer },
        { provide: WINDOW, useValue: mockWindow }
      ]
    });

    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isDark based on localStorage if value exists', () => {
      localStorage.setItem('preferred-theme', 'dark');
      component.ngOnInit();
      expect(component.isDark).toBe(true);
    });

    it('should set isDark based on media query if localStorage value does not exist', () => {
      localStorage.removeItem('preferred-theme');
      component.ngOnInit();
      expect(component.isDark).toBe(true);
      expect(mockWindow.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('should call changeThemeClass with the correct argument', () => {
      jest.spyOn(component as any, 'changeThemeClass');
      component.ngOnInit();
      expect((component as any).changeThemeClass).toHaveBeenCalledWith(true);
    });
  });

  describe('onToggleChange', () => {
    it('should toggle theme, save preference to localStorage, and call changeThemeClass', () => {
      const mockEvent: MatSlideToggleChange = { checked: false } as MatSlideToggleChange;
      jest.spyOn(component as any, 'changeThemeClass');
      component.onToggleChange(mockEvent);

      expect(component.isDark).toBe(false);
      expect(localStorage.getItem('preferred-theme')).toBe('light');
      expect((component as any).changeThemeClass).toHaveBeenCalledWith(false);
    });

    it('should send the correct message to the user', () => {
      const mockEvent: MatSlideToggleChange = { checked: true } as MatSlideToggleChange;
      const darkMessageKey = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.DARK_THEME_ON';

      component.onToggleChange(mockEvent);

      expect(mockTranslateService.instant).toHaveBeenCalledWith(darkMessageKey);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new ShowMessageBar({
          message: darkMessageKey,
          type: 'success',
          infinityDuration: false
        })
      );
    });
  });

  describe('changeThemeClass', () => {
    it('should update the body element when theme changes', () => {
      const bodyClassListSpy = jest.spyOn(document.body.classList, 'add');
      const removeClassListSpy = jest.spyOn(document.body.classList, 'remove');

      // Trigger dark theme
      (component as any).changeThemeClass(true);
      expect(bodyClassListSpy).toHaveBeenCalledWith('dark-theme');
      expect(removeClassListSpy).toHaveBeenCalledWith('light-theme');

      // Trigger light theme
      (component as any).changeThemeClass(false);
      expect(bodyClassListSpy).toHaveBeenCalledWith('light-theme');
      expect(removeClassListSpy).toHaveBeenCalledWith('dark-theme');
    });
  });

  describe('showMessage', () => {
    it('should dispatch the ShowMessageBar action with correct arguments', () => {
      const message = 'Test message';
      const type: MessageBarType = 'success';
      const infinityDuration = false;

      (component as any).showMessage(message, type, infinityDuration);

      expect(mockStore.dispatch).toHaveBeenCalledWith(new ShowMessageBar({ message, type, infinityDuration }));
    });
  });
});
