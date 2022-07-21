import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSidenavModule,
        NgxsModule.forRoot([])
      ],
      declarations: [
        AppComponent,
        MockHeaderComponent,
        MockShellComponent,
        MockFooterComponent,
        MockSidenavComponent,
        MockSidenavFilterComponent
      ],
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
class MockHeaderComponent{
  @Input() isMobileView: boolean;
}

@Component({
  selector: 'app-shell',
  template: ''
})
class MockShellComponent{}

@Component({
  selector: 'app-footer',
  template: ''
})
class MockFooterComponent{}

@Component({
  selector: 'app-sidenav-menu',
  template: ''
})
class MockSidenavComponent{
  @Input() isMobileView: boolean;
}

@Component({
  selector: 'app-sidenav-filters',
  template: ''
})
class MockSidenavFilterComponent{
  @Input() isMobileView: boolean;
}
