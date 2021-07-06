import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMobileBarComponent } from './navigation-mobile-bar.component';

describe('NavigationMobileBarComponent', () => {
  let component: NavigationMobileBarComponent;
  let fixture: ComponentFixture<NavigationMobileBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationMobileBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMobileBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
