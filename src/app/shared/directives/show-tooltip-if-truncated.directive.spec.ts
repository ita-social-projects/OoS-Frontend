import { ShowTooltipIfTruncatedDirective } from './show-tooltip-if-truncated.directive';
import { MatTooltip } from '@angular/material/tooltip';
import { ElementRef } from '@angular/core';

const elementRef = {} as ElementRef;
const matToolTip = MatTooltip;


describe('ShowTooltipIfTruncatedDirective', () => {
  it('should create an instance', () => {
    const directive = new ShowTooltipIfTruncatedDirective(elementRef, matToolTip.prototype);
    expect(directive).toBeTruthy();
  });
});
