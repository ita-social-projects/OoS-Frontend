import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { By } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { StepperDirective } from './stepper.directive';

@Component({
  template:
    '<div id="cdk-step-content-0-0">' +
    '<input id="invalidField" class="ng-invalid">' +
    '<input id="hiddenField" class="ng-invalid" style="display: none;">' +
    '<input id="zeroSizeField" class="ng-invalid">' +
    '<div style="visibility: hidden;">' +
    '<input id="hiddenParentField" class="ng-invalid">' +
    '</div>' +
    '</div>' +
    '<button appStepperNext [form]="form" [stepper]="stepper"></button>' +
    '<button appStepperNext [stepper]="stepper" [appStepperNext]="submitFn"></button>'
})
class TestComponent {
  form: FormGroup;
  stepper = { next: jest.fn(), selectedIndex: 0 } as unknown as MatStepper;
  submitFn = jest.fn();
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
      instant: jest.fn().mockReturnValue(of('Required fields are empty'))
    } as unknown as jest.Mocked<TranslateService>;

    TestBed.configureTestingModule({
      declarations: [StepperDirective, TestComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: TranslateService, useValue: mockTranslate }
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
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 0;
    });
    fixture.componentInstance.form.setErrors({ invalid: true });
    const spyUpdateValueAndValidity = jest.spyOn(fixture.componentInstance.form, 'updateValueAndValidity');
    const invalidInput = document.getElementById('invalidField');
    const spyScrollIntoView = jest.fn();
    const spyFocus = jest.fn();
    invalidInput.scrollIntoView = spyScrollIntoView;
    invalidInput.focus = spyFocus;

    invalidInput.getBoundingClientRect = jest.fn().mockReturnValue({
      width: 100,
      height: 20,
      top: 0,
      left: 0,
      bottom: 20,
      right: 100
    });

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block',
      visibility: 'visible'
    } as CSSStyleDeclaration);

    debugElement.triggerEventHandler('click', new MouseEvent('click'));
    tick();
    expect(fixture.componentInstance.form.touched).toEqual(true);
    expect(spyUpdateValueAndValidity).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(spyScrollIntoView).toHaveBeenCalled();
    expect(spyFocus).toHaveBeenCalled();
  }));

  it('should return if step element is null or undefined', () => {
    const directive = debugElement.injector.get(StepperDirective);
    const spyMarkAllAsTouched = jest.spyOn(fixture.componentInstance.form, 'markAllAsTouched');
    const spyUpdateValueAndValidity = jest.spyOn(fixture.componentInstance.form, 'updateValueAndValidity');

    (directive as any).scrollToFirstInvalidControl();
    expect(spyMarkAllAsTouched).not.toHaveBeenCalled();
    expect(spyUpdateValueAndValidity).not.toHaveBeenCalled();
  });

  it('should call submit function when form is valid and submit is provided', () => {
    const submitButton = fixture.debugElement.queryAll(By.directive(StepperDirective))[1];
    fixture.componentInstance.form.patchValue({ control1: 'valid', control2: 'valid' });

    submitButton.triggerEventHandler('click', new MouseEvent('click'));

    expect(fixture.componentInstance.submitFn).toHaveBeenCalled();
    expect(fixture.componentInstance.stepper.next).not.toHaveBeenCalled();
  });

  it('should call submit function when no form is provided and submit is provided', () => {
    const submitButton = fixture.debugElement.queryAll(By.directive(StepperDirective))[1];
    const directive = submitButton.injector.get(StepperDirective);
    directive.form = null;

    submitButton.triggerEventHandler('click', new MouseEvent('click'));

    expect(fixture.componentInstance.submitFn).toHaveBeenCalled();
    expect(fixture.componentInstance.stepper.next).not.toHaveBeenCalled();
  });

  describe('isElementVisible edge cases', () => {
    let directive: StepperDirective;

    beforeEach(() => {
      directive = debugElement.injector.get(StepperDirective);
      fixture.componentInstance.form.setErrors({ invalid: true });
    });

    it('should return false when element has display: none', fakeAsync(() => {
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        callback(0);
        return 0;
      });

      const hiddenField = document.getElementById('hiddenField');
      const spyScrollIntoView = jest.fn();
      const spyFocus = jest.fn();
      hiddenField.scrollIntoView = spyScrollIntoView;
      hiddenField.focus = spyFocus;

      jest.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
        if (element === hiddenField) {
          return { display: 'none', visibility: 'visible' } as CSSStyleDeclaration;
        }
        return { display: 'block', visibility: 'visible' } as CSSStyleDeclaration;
      });

      debugElement.triggerEventHandler('click', new MouseEvent('click'));
      tick();

      expect(spyScrollIntoView).not.toHaveBeenCalled();
      expect(spyFocus).not.toHaveBeenCalled();
    }));

    it('should return false when element has visibility: hidden', fakeAsync(() => {
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        callback(0);
        return 0;
      });

      const hiddenField = document.getElementById('hiddenField');
      const spyScrollIntoView = jest.fn();
      const spyFocus = jest.fn();
      hiddenField.scrollIntoView = spyScrollIntoView;
      hiddenField.focus = spyFocus;

      jest.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
        if (element === hiddenField) {
          return { display: 'block', visibility: 'hidden' } as CSSStyleDeclaration;
        }
        return { display: 'block', visibility: 'visible' } as CSSStyleDeclaration;
      });

      debugElement.triggerEventHandler('click', new MouseEvent('click'));
      tick();

      expect(spyScrollIntoView).not.toHaveBeenCalled();
      expect(spyFocus).not.toHaveBeenCalled();
    }));

    it('should return false when element has zero width and height', fakeAsync(() => {
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        callback(0);
        return 0;
      });

      const zeroSizeField = document.getElementById('zeroSizeField');
      const spyScrollIntoView = jest.fn();
      const spyFocus = jest.fn();
      zeroSizeField.scrollIntoView = spyScrollIntoView;
      zeroSizeField.focus = spyFocus;

      zeroSizeField.getBoundingClientRect = jest.fn().mockReturnValue({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      });

      jest.spyOn(window, 'getComputedStyle').mockReturnValue({
        display: 'block',
        visibility: 'visible'
      } as CSSStyleDeclaration);

      debugElement.triggerEventHandler('click', new MouseEvent('click'));
      tick();

      expect(spyScrollIntoView).not.toHaveBeenCalled();
      expect(spyFocus).not.toHaveBeenCalled();
    }));

    it('should return false when parent element is hidden', fakeAsync(() => {
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        callback(0);
        return 0;
      });

      const hiddenParentField = document.getElementById('hiddenParentField');
      const spyScrollIntoView = jest.fn();
      const spyFocus = jest.fn();
      hiddenParentField.scrollIntoView = spyScrollIntoView;
      hiddenParentField.focus = spyFocus;

      hiddenParentField.getBoundingClientRect = jest.fn().mockReturnValue({
        width: 100,
        height: 20,
        top: 0,
        left: 0,
        bottom: 20,
        right: 100
      });

      jest.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
        if (element === hiddenParentField) {
          return { display: 'block', visibility: 'visible' } as CSSStyleDeclaration;
        }
        if (element === hiddenParentField.parentElement) {
          return { display: 'block', visibility: 'hidden' } as CSSStyleDeclaration;
        }
        return { display: 'block', visibility: 'visible' } as CSSStyleDeclaration;
      });

      debugElement.triggerEventHandler('click', new MouseEvent('click'));
      tick();

      expect(spyScrollIntoView).not.toHaveBeenCalled();
      expect(spyFocus).not.toHaveBeenCalled();
    }));
  });

  describe('form or stepper not provided', () => {
    let directive: StepperDirective;

    beforeEach(() => {
      directive = debugElement.injector.get(StepperDirective);
    });

    it('should return if form is not provided', () => {
      fixture.componentInstance.form = undefined;
      fixture.detectChanges();
    });

    it('should return if stepper is not provided', () => {
      directive.stepper = undefined;
      fixture.detectChanges();
    });

    afterEach(() => {
      const spyScrollToFirstInvalidControl = jest.spyOn(directive as any, 'scrollToFirstInvalidControl');
      debugElement.triggerEventHandler('click', new MouseEvent('click'));
      expect(fixture.componentInstance.stepper.next).not.toHaveBeenCalled();
      expect(spyScrollToFirstInvalidControl).not.toHaveBeenCalled();
    });
  });
});
