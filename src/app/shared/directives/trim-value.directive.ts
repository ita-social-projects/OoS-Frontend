import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrimValue]'
})

export class TrimValueDirective {

  constructor(private ngControl: NgControl, private el: ElementRef) {
  }

  @HostListener('blur') onBlur(): void {
    this.ngControl.control.setValue(this.el.nativeElement.value.trim());
  }
}
