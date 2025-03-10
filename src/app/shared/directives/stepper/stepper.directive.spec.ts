import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { WINDOW } from 'ngx-window-token';
import { of } from 'rxjs';
import { StepperDirective } from './stepper.directive';

@Component({
  template:
    '<div id="cdk-step-content-0-0">' +
    '<input id="invalidField" class="ng-invalid">' +
    '</div>' +
    '<button appStepperNext [form]="form" [stepper]="stepper"></button>'
})
class TestComponent {
  form: FormGroup;
  stepper = { next: jest.fn(), selectedIndex: 0 } as unknown as MatStepper;
}

describe('StepperDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;
  let mockStore: jest.Mocked<Store>;
  let mockTranslate: jest.Mocked<TranslateService>;

  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn()
    } as unknown as jest.Mocked<Store>;

    mockTranslate = {
      get: jest.fn().mockReturnValue(of('Required fields are empty'))
    } as unknown as jest.Mocked<TranslateService>;

    TestBed.configureTestingModule({
      declarations: [StepperDirective, TestComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: WINDOW, useValue: window }
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.form = new FormGroup({
      control1: new FormControl('control1', Validators.required),
      control2: new FormControl('control2', Validators.required)
    });
    debugElement = fixture.debugElement.query(By.directive(StepperDirective));
    fixture.detectChanges();
  });

  it('should pass step if form is valid', () => {
    debugElement.triggerEventHandler('click', new MouseEvent('click'));

    expect(fixture.componentInstance.stepper.next).toHaveBeenCalled();
  });

  it('should NOT call stepper.next() if form is invalid', () => {
    fixture.componentInstance.form.setErrors({ invalid: true });
    debugElement.triggerEventHandler('click', new MouseEvent('click'));

    expect(fixture.componentInstance.stepper.next).not.toHaveBeenCalled();
  });

  it('should touch form, scroll to input and dispatch ShowMessageBar if form is invalid', fakeAsync(() => {
    fixture.componentInstance.form.setErrors({ invalid: true });
    const spyUpdateValueAndValidity = jest.spyOn(fixture.componentInstance.form, 'updateValueAndValidity');
    const invalidInput = document.getElementById('invalidField');
    invalidInput.scrollIntoView = jest.fn();
    invalidInput.focus = jest.fn();
    debugElement.triggerEventHandler('click', new MouseEvent('click'));
    expect(fixture.componentInstance.form.touched).toEqual(true);
    expect(spyUpdateValueAndValidity).toHaveBeenCalled();
    expect(invalidInput.scrollIntoView).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalled();
    tick(1000);
    expect(invalidInput.focus).toHaveBeenCalled();
  }));
});
