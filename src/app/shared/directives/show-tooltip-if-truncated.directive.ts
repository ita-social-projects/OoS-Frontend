import { MatTooltip } from '@angular/material/tooltip';
import { AfterViewInit, ElementRef } from '@angular/core';
import { Directive } from '@angular/core';

@Directive({
  selector: '[matTooltip][showTooltipIfTruncated]'
})
export class ShowTooltipIfTruncatedDirective implements AfterViewInit {

  constructor(
    private el: ElementRef,
    private matTooltip: MatTooltip
    ) { }

  ngAfterViewInit(): void {
   this.matTooltip.disabled = this.el.nativeElement.scrollWidth <= this.el.nativeElement.clientWidth;
  }

}
