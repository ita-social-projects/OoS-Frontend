import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSidenavModule
      ],
      declarations: [
        AppComponent,
        MockHeaderComponent,
        MockShellComponent,
        MockFooterComponent,
        MockSidenavComponent
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
class MockHeaderComponent{}

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
  selector: 'app-sidenav',
  template: ''
})
class MockSidenavComponent{
  @Input() MobileScreen: boolean;
}
