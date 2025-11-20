import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[type=text], textarea'
})
export class NormalizeCrlfDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  @HostListener('paste', ['$event'])
  public onInput(event: Event | ClipboardEvent): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const maxLengthAttr = target.getAttribute('maxlength');
    const maxLength = maxLengthAttr ? parseInt(maxLengthAttr, 10) : Infinity;

    const control = this.ngControl?.control;

    let value: string;

    if (event instanceof ClipboardEvent) {
      event.preventDefault();
      value = event.clipboardData?.getData('text') || '';
      const start = target.selectionStart ?? 0;
      const end = target.selectionEnd ?? 0;
      value = target.value.substring(0, start) + value + target.value.substring(end);
    } else {
      value = target.value;
    }

    const normalized = this.normalize(value, maxLength);

    target.value = normalized;
    if (control) {
      control.setValue(normalized, { emitEvent: false });
    }
  }

  private normalize(value: string, maxLength: number): string {
    let text = value.replace(/\r?\n/g, '\r\n');
    if (text.length > maxLength) {
      text = text.substring(0, maxLength);
    }
    return text;
  }
}
