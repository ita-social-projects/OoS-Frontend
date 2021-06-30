import { createInject } from '@angular/compiler/src/core';
import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPlaceholderForm]'
})
export class PlaceholderFormDirective implements AfterViewInit{

  constructor(private el: ElementRef, private r: Renderer2) {
  }

  // change placeholder properties for mat-select element
  
  ngAfterViewInit() {
    // this.r.setStyle(this.el.nativeElement.getElementsByClassName('mat-select-placeholder')[0], 'color', 'grey')
  
    let getElement = this.el.nativeElement.getElementsByClassName('mat-form-field-label')
    
    if (getElement.length > 0) {
      this.r.setStyle(getElement[0], 'color', 'green')
    }
    
    // this.r.setStyle(this.el.nativeElement.getElementsByClassName('mat-form-field-label-wrapper')[0], 'margin-left', '15px')
    // this.r.setStyle(this.el.nativeElement.getElementsByClassName('mat-form-field-label-wrapper')[0], 'margin-top', '10px')
    
  }
}
