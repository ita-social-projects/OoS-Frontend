import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { ValidationHintComponent } from './validation-hint.component';

describe('ValidationHintComponent', () => {
  let component: ValidationHintComponent;
  let fixture: ComponentFixture<ValidationHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidationHintComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationHintComponent);
    component = fixture.componentInstance;
    component.validationFormControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
