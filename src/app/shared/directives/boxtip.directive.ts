import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBoxtip]'
})
export class BoxtipDirective {

  constructor() { }

  @HostListener('mouseover', ['$event'])
  onMouseover(event: MouseEvent): void {


  }

}
