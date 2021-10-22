import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[appMinMax]'
})
export class MinMaxDirective {

  @Input() public min: number;
  @Input() public max: number;
  @Input() public directiveFormControl: FormControl;


  constructor(private ref: ElementRef) { }

  @HostListener('input', ['$event'])
  public onInput(event: InputEvent): void {
    this.MaxMinValidation();
  }

  public handleKeyboardEvent(event: KeyboardEvent): void {
    this.MaxMinValidation();
  }

  private MaxMinValidation(): void {
    const val = Number(this.ref.nativeElement.value);
    if (this.max !== null && this.max !== undefined && val >= this.max) {
      this.directiveFormControl.setValue(this.max);
    }
    else if (this.min !== null && this.min !== undefined && val <= this.min) {
      this.directiveFormControl.setValue(this.min);
    }
  }
}
