import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appMinMax]'
})
export class MinMaxDirective {
  @Input() public maxValue!: number;
  @Input() public minValue!: number;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  public onInput(event: Event): void {
    const input = this.el.nativeElement;
    const value = parseFloat(input.value);

    if (isNaN(value)) {
      return;
    }
    if (this.maxValue != null && value > this.maxValue) {
      input.value = this.maxValue.toString();
    }
    if (this.minValue != null && value < this.minValue) {
      input.value = this.minValue.toString();
    }
  }
}
