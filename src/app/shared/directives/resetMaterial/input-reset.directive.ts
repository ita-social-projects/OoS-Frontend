import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appInputReset]'
})
export class InputResetDirective {

  constructor(private el: ElementRef) {
    el.nativeElement.style.border = 'none';
   }

}
