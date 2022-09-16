import { MatTooltip } from '@angular/material/tooltip';
import { ElementRef } from '@angular/core';
import { Directive } from '@angular/core';

@Directive({
  selector: '[matTooltip][showTooltipIfTruncated]',
  host: {
    '(mouseenter)': 'onMouseHover()'
  }
})
export class ShowTooltipIfTruncatedDirective {

  constructor(private el: ElementRef, private matTooltip: MatTooltip) { }

  onMouseHover() {
    this.matTooltip.disabled = this.el.nativeElement.scrollWidth <= this.el.nativeElement.clientWidth;
  }
}
