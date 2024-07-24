import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SearchFieldValidationDirective } from './search-field-validation.directive';

@Component({
  template: '<input appSearchFieldValidation/>'
})
class TestComponent {}

describe('SearchFieldValidationDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchFieldValidationDirective, TestComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.directive(SearchFieldValidationDirective)).nativeElement;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new SearchFieldValidationDirective(inputEl);
    expect(directive).toBeTruthy();
  });

  it('should remove invalid characters from input value', () => {
    const directiveInstance = fixture.debugElement
      .query(By.directive(SearchFieldValidationDirective))
      .injector.get(SearchFieldValidationDirective);
    jest.spyOn(directiveInstance.invalidCharacterDetected, 'emit');
    jest.spyOn(directiveInstance.validCharacterDetected, 'emit');

    inputEl.value = 'Test@123';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('Test123');
    expect(directiveInstance.invalidCharacterDetected.emit).toHaveBeenCalled();
    expect(directiveInstance.validCharacterDetected.emit).not.toHaveBeenCalled();
  });

  it('should emit validCharacterDetected event when only valid characters are input', () => {
    const directiveInstance = fixture.debugElement
      .query(By.directive(SearchFieldValidationDirective))
      .injector.get(SearchFieldValidationDirective);
    jest.spyOn(directiveInstance.invalidCharacterDetected, 'emit');
    jest.spyOn(directiveInstance.validCharacterDetected, 'emit');

    inputEl.value = 'Test123';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('Test123');
    expect(directiveInstance.invalidCharacterDetected.emit).not.toHaveBeenCalled();
    expect(directiveInstance.validCharacterDetected.emit).toHaveBeenCalled();
  });

  it('should stop propagation of the input event when invalid characters are detected', () => {
    const directiveInstance = fixture.debugElement
      .query(By.directive(SearchFieldValidationDirective))
      .injector.get(SearchFieldValidationDirective);
    const event = new Event('input');
    jest.spyOn(event, 'stopPropagation');
    inputEl.value = 'Test@123';
    inputEl.dispatchEvent(event);
    fixture.detectChanges();

    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
