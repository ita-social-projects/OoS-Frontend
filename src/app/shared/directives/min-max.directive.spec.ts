import { ElementRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { MinMaxDirective } from './min-max.directive';

describe('MinMaxDirective', () => {
  let mockElementRef: ElementRef;
  let directive: MinMaxDirective;

  beforeEach(() => {
    mockElementRef = { nativeElement: document.createElement('input') };
    mockElementRef.nativeElement.value = '5';
    directive = new MinMaxDirective(mockElementRef);
    directive.min = 0;
    directive.max = 100;
    directive.directiveFormControl = new FormControl();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('validate method', () => {
    it('should set max value if input is bigger', fakeAsync(() => {
      jest.spyOn(directive.directiveFormControl, 'setValue');
      mockElementRef.nativeElement.value = '200';

      directive.ngOnInit();
      directive.onInput(null);
      tick(1000);

      expect(directive.directiveFormControl.setValue).toHaveBeenCalledWith(directive.max);
      expect(directive.directiveFormControl.value).toEqual(directive.max);
    }));

    it('should set min value if input is smaller', fakeAsync(() => {
      jest.spyOn(directive.directiveFormControl, 'setValue');
      mockElementRef.nativeElement.value = '-200';

      directive.ngOnInit();
      directive.onInput(null);
      tick(1000);

      expect(directive.directiveFormControl.setValue).toHaveBeenCalledWith(directive.min);
      expect(directive.directiveFormControl.value).toEqual(directive.min);
    }));
  });
});
