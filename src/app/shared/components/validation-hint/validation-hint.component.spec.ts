import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationHintComponent } from './validation-hint.component';

describe('ValidationHintComponent', () => {
  let component: ValidationHintComponent;
  let fixture: ComponentFixture<ValidationHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationHintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});