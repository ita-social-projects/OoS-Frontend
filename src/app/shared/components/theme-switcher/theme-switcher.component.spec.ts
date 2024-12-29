import { NgxsModule, Store } from '@ngxs/store';
import { ShowMessageBar } from 'shared/store/app.actions';
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThemeSwitcherComponent],
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot()]
    });
    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
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
});
