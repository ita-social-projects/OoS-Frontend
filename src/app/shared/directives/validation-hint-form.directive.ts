import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appValidationHintForm]'
})
export class ValidationHintFormDirective {

  constructor(private el: ElementRef, private r: Renderer2) {
   
    // change properties for validation hint message 

    this.r.setStyle(this.el.nativeElement, 'display', 'block')
    this.r.setStyle(this.el.nativeElement, 'color', 'red')
  }
}
