import { Directive, ElementRef, HostListener } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[matTooltip][showTooltipIfTruncated]'
})
export class ShowTooltipIfTruncatedDirective {
  constructor(
    private el: ElementRef,
    private matTooltip: MatTooltip
  ) {}

  @HostListener('mouseenter')
  public onMouseHover(): void {
    this.matTooltip.disabled = this.el.nativeElement.scrollWidth <= this.el.nativeElement.clientWidth;
  }
}
