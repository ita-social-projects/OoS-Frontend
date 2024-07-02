import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appSearchFieldValidation]'
})
export class SearchFieldValidationDirective {
  @Output() invalidCharacterDetected = new EventEmitter<void>();
  @Output() validCharacterDetected = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: InputEvent): void {
    const initValue = this.el.nativeElement.value;

    this.el.nativeElement.value = initValue.replace(/[^A-Za-zА-Яа-я0-9`'\/.,№"']+/g, '');
    if (initValue !== this.el.nativeElement.value) {
      event.stopPropagation();
      this.invalidCharacterDetected.emit();
    } else {
      this.validCharacterDetected.emit();
    }
  }
}
