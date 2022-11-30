import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDigitOnly]'
})
export class DigitOnlyDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: InputEvent): void {
    const initValue = this.el.nativeElement.value;

    this.el.nativeElement.value = initValue.replace(/[^0-9]*/g, '');
    if (initValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
