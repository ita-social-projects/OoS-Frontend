import { ElementRef } from '@angular/core';
import { DateInputDirective } from 'shared/directives/date-input/date-input.directive';

describe('DateInputDirective', () => {
  let mockElementRef: ElementRef;
  let directive: DateInputDirective;

  beforeEach(() => {
    mockElementRef = { nativeElement: document.createElement('input') };
    directive = new DateInputDirective(mockElementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('onInput()', () => {
    it('should add "/" if value length matches', () => {
      mockElementRef.nativeElement.value = '12';
      const event = { inputType: 'insertText' } as InputEvent;

      directive.onInput(event);

      expect(mockElementRef.nativeElement.value).toBe('12/');
    });

    it('should not add "/" if it is already at the correct positions', () => {
      mockElementRef.nativeElement.value = '12/';
      const event = { inputType: 'insertText' } as InputEvent;

      directive.onInput(event);

      expect(mockElementRef.nativeElement.value).toBe('12/');
    });
  });

  describe('onPaste()', () => {
    it('should add "/" to the pasted value at correct positions with correct input', () => {
      const dispatchEventSpy = jest.spyOn(mockElementRef.nativeElement, 'dispatchEvent');
      const event = {
        clipboardData: { getData: () => '12122004' },
        preventDefault: jest.fn()
      } as unknown as ClipboardEvent;

      directive.onPaste(event);

      expect(mockElementRef.nativeElement.value).toBe('12/12/2004');
      expect(event.preventDefault).toHaveBeenCalled();
      expect(dispatchEventSpy).toHaveBeenCalledWith(new Event('input'));
    });

    it('should add "/" to the pasted value at correct positions with incorrect input', () => {
      const dispatchEventSpy = jest.spyOn(mockElementRef.nativeElement, 'dispatchEvent');
      const event = {
        clipboardData: { getData: () => '122200' },
        preventDefault: jest.fn()
      } as unknown as ClipboardEvent;

      directive.onPaste(event);

      expect(mockElementRef.nativeElement.value).toBe('12/22/00');
      expect(event.preventDefault).toHaveBeenCalled();
      expect(dispatchEventSpy).toHaveBeenCalledWith(new Event('input'));
    });
  });

  describe('validateOnInput()', () => {
    it('should add "/" at correct positions when needed', () => {
      expect(directive.formatDate('12')).toBe('12/');
      expect(directive.formatDate('12/12')).toBe('12/12/');
    });

    it('should not add "/" if it is already at the correct positions', () => {
      expect(directive.formatDate('12/')).toBe('12/');
      expect(directive.formatDate('12/12/')).toBe('12/12/');
    });
  });

  describe('validateOnPaste()', () => {
    it('should insert "/" at correct positions for pasted value', () => {
      const result = directive.formatDate('12122004');
      expect(result).toBe('12/12/2004');
    });

    it('should handle empty pasted value', () => {
      const result = directive.formatDate('');
      expect(result).toBe('');
    });
  });
});
