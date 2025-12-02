import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appDateInput]'
})
export class DateInputDirective implements OnInit {
  private indexesToInsert = [2, 5];
  private dateRegex: RegExp = new RegExp('[^0-9/]+', 'g');

  constructor(private ref: ElementRef) {}

  @HostListener('input', ['$event'])
  public onInput(event: InputEvent): void {
    const value = this.ref.nativeElement.value;

    if (event.inputType !== 'deleteContentBackward') {
      this.ref.nativeElement.value = this.formatDate(value.replace(this.dateRegex, ''));
    }
  }

  @HostListener('paste', ['$event'])
  public onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text') ?? '';

    this.ref.nativeElement.value = this.formatDate(pastedText.replace(this.dateRegex, ''));
    this.ref.nativeElement.dispatchEvent(new Event('input'));
  }

  public ngOnInit(): void {
    this.ref.nativeElement.setAttribute('maxlength', '10');
  }

  private formatDate(value: string): string {
    let formattedValue = this.digitsOnly(value);
    formattedValue = this.insertSlashes(formattedValue);
    return formattedValue.slice(0, 10);
  }

  private insertSlashes(str: string): string {
    const arr = str.split('');
    this.indexesToInsert.forEach((i, idx) => {
      if (str.length < i - idx) {
        return arr.join('');
      }
      if (arr[i] !== '/') {
        arr.splice(i, 0, '/');
      }
    });
    return arr.join('');
  }

  private digitsOnly(str: string): string {
    return str.replace(/\//g, '');
  }
}
