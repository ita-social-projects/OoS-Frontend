import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateInput]'
})
export class DateInputDirective {
  private indexesToInsert = [2, 5];

  constructor(private ref: ElementRef) {}

  @HostListener('input', ['$event'])
  public onInput(event: InputEvent): void {
    const value = this.ref.nativeElement.value;

    if (event.inputType !== 'deleteContentBackward') {
      this.ref.nativeElement.value = this.formatDate(value);
    }
  }

  @HostListener('paste', ['$event'])
  public onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text') || '';

    this.ref.nativeElement.value = this.formatDate(pastedText);
    this.ref.nativeElement.dispatchEvent(new Event('input'));
  }

  // private formatOnInput(value: string): string {
  //   if (
  //     this.indexesToInsert.includes(value.length) &&
  //     !this.indexesToInsert.every((index) => value[index] === '/') &&
  //     value.at(value.length - 1) !== '/'
  //   ) {
  //     return value + '/';
  //   } else {
  //     return value;
  //   }
  // }
  //
  // private formatOnPaste(value: string): string {
  //   if (!value) {
  //     return '';
  //   }
  //   return this.indexesToInsert.reduce((acc, index) => acc.slice(0, index) + '/' + acc.slice(index), value);
  // }

  private formatDate(value: string): string {
    return this.indexesToInsert.reduce((acc, index) => {
      if (value.length >= index && acc.at(index) !== '/') {
        return acc.slice(0, index) + '/' + acc.slice(index);
      }
      return acc;
    }, value);
  }
}
