import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionsWrapperComponent } from './directions-wrapper.component';

describe('DirectionsWrapperComponent', () => {
  let component: DirectionsWrapperComponent;
  let fixture: ComponentFixture<DirectionsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectionsWrapperComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DirectionsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
