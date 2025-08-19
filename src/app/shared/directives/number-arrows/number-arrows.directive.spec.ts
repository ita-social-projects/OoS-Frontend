import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NumberArrowsDirective } from './number-arrows.directive';

@Component({
  template: '<input type="number" />'
})
class TestHostComponent {}

describe('NumberArrowsDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, NumberArrowsDirective]
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create directive and wrap input', () => {
    const input = fixture.debugElement.query(By.css('input[type=number]')).nativeElement;
    expect(input.parentNode.tagName.toLowerCase()).toBe('div');
    const wrapper = input.parentNode;
    expect(wrapper.querySelectorAll('mat-icon').length).toBe(2);
  });

  it('should call stepUp when clicking up icon', () => {
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const upIcon: HTMLElement = input.parentNode.querySelector('mat-icon');

    const spyStepUp = jest.spyOn(input, 'stepUp');

    upIcon.dispatchEvent(new MouseEvent('mousedown'));
    fixture.detectChanges();

    expect(spyStepUp).toHaveBeenCalled();
  });

  it('should call stepDown when clicking down icon', () => {
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const downIcon: HTMLElement = input.parentNode.querySelectorAll('mat-icon')[1] as HTMLElement;

    const spyStepDown = jest.spyOn(input, 'stepDown');

    downIcon.dispatchEvent(new MouseEvent('mousedown'));
    fixture.detectChanges();

    expect(spyStepDown).toHaveBeenCalled();
  });

  it('should show icons on hover and hide on leave', () => {
    const wrapper: HTMLElement = fixture.debugElement.query(By.css('input')).nativeElement.parentNode;
    const [upIcon, downIcon] = wrapper.querySelectorAll('mat-icon') as any;

    expect(upIcon.style.display).toBe('none');
    expect(downIcon.style.display).toBe('none');

    wrapper.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    expect(upIcon.style.display).toBe('flex');
    expect(downIcon.style.display).toBe('flex');

    wrapper.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();

    expect(upIcon.style.display).toBe('none');
    expect(downIcon.style.display).toBe('none');
  });
});
