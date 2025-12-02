import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { MinMaxDirective } from './min-max.directive';

@Component({
  template: '<input type="number" appMinMax [minValue]="minValue" [maxValue]="maxValue" />'
})
class TestComponent {
  minValue = 1;
  maxValue = 10;
}

describe('MinMaxDirective (Jest)', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, MinMaxDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    inputEl = fixture.debugElement.query(By.directive(MinMaxDirective));
    input = inputEl.nativeElement;
  });

  function setValueAndDispatch(val: string) {
    input.value = val;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('should keep value if in range', () => {
    setValueAndDispatch('5');
    expect(input.value).toBe('5');
  });

  it('should set value to maxValue when above max', () => {
    setValueAndDispatch('20');
    expect(input.value).toBe('10');
  });

  it('should set value to minValue when below min', () => {
    setValueAndDispatch('-2');
    expect(input.value).toBe('1');
  });

  it('should ignore non-numeric input', () => {
    setValueAndDispatch('abc');
    expect(input.value).toBe('');
  });

  it('should work without maxValue', () => {
    fixture.componentInstance.maxValue = null as any;
    fixture.detectChanges();

    setValueAndDispatch('500');
    expect(input.value).toBe('500');
  });

  it('should work without minValue', () => {
    fixture.componentInstance.minValue = null as any;
    fixture.detectChanges();

    setValueAndDispatch('-100');
    expect(input.value).toBe('-100');
  });
});
