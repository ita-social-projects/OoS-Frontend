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

import { MessageBarComponent } from 'shared/components/message-bar/message-bar.component';
import { MessageBarData } from 'shared/models/message-bar.model';
import { ClearMessageBar, ShowMessageBar } from 'shared/store/app.actions';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: Store;
  let mockMatSnackBar: MatSnackBar;

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

  describe('showSnackBar method', () => {
    const messagePayload: MessageBarData = { message: 'test', type: 'success' };

    it('should show snackBar on action dispatch with provided payload', () => {
      jest.spyOn(mockMatSnackBar, 'openFromComponent');

      component.ngOnInit();
      store.dispatch([new ShowMessageBar(messagePayload), new ClearMessageBar()]);

      expect(mockMatSnackBar.openFromComponent).toHaveBeenCalledWith(MessageBarComponent, {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: messagePayload.type,
        data: messagePayload
      });
    });
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
