import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SharedModule } from 'shared/shared.module';
import { IntegerOnlyDirective } from './integer-only.directive';

describe('IntegerOnlyDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: HTMLInputElement;
  let directive: IntegerOnlyDirective;

  @Component({
    template: '<input appIntegerOnly>'
  })
  class TestComponent {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SharedModule]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    directive = fixture.debugElement.query(By.directive(IntegerOnlyDirective)).injector.get(IntegerOnlyDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should allow digit input', () => {
    const event = new InputEvent('beforeinput', { data: '5' });
    jest.spyOn(event, 'preventDefault');

    directive.onBeforeInput(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should prevent non-digit input', () => {
    const event = new InputEvent('beforeinput', { data: 'a' });
    jest.spyOn(event, 'preventDefault');

    directive.onBeforeInput(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should handle null event data', () => {
    const event = new InputEvent('beforeinput', { data: null });
    jest.spyOn(event, 'preventDefault');

    expect(() => directive.onBeforeInput(event)).not.toThrow();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should prevent paste with non-digit text', () => {
    const event = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer()
    });
    event.clipboardData?.setData('text', '5.5');
    Object.defineProperty(event, 'target', { value: inputElement });
    jest.spyOn(event, 'preventDefault');

    directive.onPaste(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });
});
