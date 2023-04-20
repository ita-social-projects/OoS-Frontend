import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPlaceholderStyling]'
})
export class PlaceholderFormDirective implements AfterViewInit {
  constructor(private el: ElementRef, private r: Renderer2) {}

  /**
   * This directive change placeholder styling ptoperties for input forms
   */

  ngAfterViewInit(): void {
    const datePickerPlaceholder = this.el.nativeElement.getElementsByClassName('mat-form-field-label');

    if (datePickerPlaceholder.length > 0) {
      this.r.setStyle(datePickerPlaceholder[0], 'color', 'grey');
    }

    const selectOptionPlaceholder = this.el.nativeElement.getElementsByClassName('mat-select-placeholder');

    if (selectOptionPlaceholder.length > 0) {
      this.r.setStyle(selectOptionPlaceholder[0], 'color', 'grey');
    }
  }
}
