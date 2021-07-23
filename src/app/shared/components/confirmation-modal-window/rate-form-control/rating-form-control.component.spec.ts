import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingFormControlComponent } from './rating-form-control.component';

describe('RateFormControlComponent', () => {
  let component: RatingFormControlComponent;
  let fixture: ComponentFixture<RatingFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingFormControlComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
