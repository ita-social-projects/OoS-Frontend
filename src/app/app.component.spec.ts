import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DateAdapter } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatSidenavModule, MatProgressBarModule, NgxsModule.forRoot([]), TranslateModule.forRoot()],
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

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
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
