import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appValidationMessageStyling]'
})
export class ValidationMessageStylingDirective {
  /**
   * This directive adds styling to error messages for input validation
   */
  constructor(
    private el: ElementRef,
    private r: Renderer2
  ) {
    this.r.setStyle(this.el.nativeElement, 'display', 'block');
    this.r.setStyle(this.el.nativeElement, 'color', 'red');
    this.r.setStyle(this.el.nativeElement, 'font-size', '10px');
  }
}
