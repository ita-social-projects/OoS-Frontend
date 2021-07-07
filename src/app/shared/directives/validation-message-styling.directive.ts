import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appValidationMessageStyling]'
})
export class ValidationMessageStyling {

  constructor(private el: ElementRef, private r: Renderer2) {
   
    // change validation message styling for Mat Input 

    this.r.setStyle(this.el.nativeElement, 'display', 'block')
    this.r.setStyle(this.el.nativeElement, 'color', 'red')
    this.r.setStyle(this.el.nativeElement, 'font-size', '10px')
  }
}
