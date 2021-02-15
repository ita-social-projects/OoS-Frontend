import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        MockHeaderComponent,
        MockShellComponent,
        MockFooterComponent
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
