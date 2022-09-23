import { MatTooltip } from '@angular/material/tooltip';
import { ElementRef, HostListener } from '@angular/core';
import { Directive } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[matTooltip][showTooltipIfTruncated]',
})
export class ShowTooltipIfTruncatedDirective {

  constructor(private el: ElementRef, private matTooltip: MatTooltip) { }

  @HostListener('mouseenter') onMouseHover(): void {
    this.matTooltip.disabled = this.el.nativeElement.scrollWidth <= this.el.nativeElement.clientWidth;
  }
}
