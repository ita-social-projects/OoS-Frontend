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
    let formattedDate = this.indexesToInsert.reduce((acc, index) => {
      if (value.length >= index && acc.at(index) !== '/' && acc.at(index - 1) !== '/' && acc.at(index + 1) !== '/') {
        return acc.slice(0, index) + '/' + acc.slice(index);
      }
      return acc;
    }, value);

    formattedDate = formattedDate.replace(/\/{2,}/g, '/');

    if (formattedDate.split('/').length > 3) {
      return formattedDate.split('/')[0] + '/' + formattedDate.split('/')[1] + '/' + formattedDate.split('/').slice(2).join('');
    }

    return formattedDate;
  }
}
