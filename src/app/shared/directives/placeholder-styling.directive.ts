import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPlaceholderStyling]'
})
export class PlaceholderFormDirective implements AfterViewInit{

  constructor(private el: ElementRef, private r: Renderer2) {
  }

  ngAfterViewInit() {
  
    // change placeholder properties for Mat Date form
    let getMatDatePlaceholder = this.el.nativeElement.getElementsByClassName('mat-form-field-label')
    
    if (getMatDatePlaceholder.length > 0) {
      this.r.setStyle(getMatDatePlaceholder[0], 'color', 'grey')
    }

    // change placeholder properties for Mat Select form
    let selectOptionPlaceholder = this.el.nativeElement.getElementsByClassName('mat-select-placeholder')
    
    if (selectOptionPlaceholder.length > 0) {
      this.r.setStyle(selectOptionPlaceholder[0], 'color', 'grey')
    }

  }
}
