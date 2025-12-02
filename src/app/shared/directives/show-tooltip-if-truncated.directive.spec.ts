import { MatTooltip } from '@angular/material/tooltip';
import { ElementRef } from '@angular/core';
import { ShowTooltipIfTruncatedDirective } from './show-tooltip-if-truncated.directive';

const elementRef = {} as ElementRef;
const matToolTip = MatTooltip.prototype;

describe('ShowTooltipIfTruncatedDirective', () => {
  it('should create an instance', () => {
    const directive = new ShowTooltipIfTruncatedDirective(elementRef, matToolTip);
    expect(directive).toBeTruthy();
  });
});
