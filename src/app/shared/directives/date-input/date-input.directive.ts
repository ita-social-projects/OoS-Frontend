import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateInput]'
})
export class DateInputDirective {
  private lengthsToInsert = [2, 5];

  constructor(private ref: ElementRef) {}

  @HostListener('input', ['$event'])
  public onInput(event: InputEvent): void {
    const value = this.ref.nativeElement.value;

    if (event.inputType !== 'deleteContentBackward') {
      this.ref.nativeElement.value = this.validateOnInput(value);
    }
  }

  @HostListener('paste', ['$event'])
  public onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text') || '';

    this.ref.nativeElement.value = this.validateOnPaste(pastedText);
    this.ref.nativeElement.dispatchEvent(new Event('input'));
  }

  private validateOnInput(value: string): string {
    if (
      this.lengthsToInsert.includes(value.length) &&
      !this.lengthsToInsert.every((index) => value[index] === '/') &&
      value.at(value.length - 1) !== '/'
    ) {
      return value + '/';
    } else {
      return value;
    }
  }

  private validateOnPaste(value: string): string {
    if (!value) {
      return '';
    }
    return this.lengthsToInsert.reduce((acc, index) => acc.slice(0, index) + '/' + acc.slice(index), value);
  }
}
