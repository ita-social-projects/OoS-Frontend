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
  public onInput(a_Event: InputEvent): void {
    this.MaxMinValidation();
  }

  public handleKeyboardEvent(event: KeyboardEvent) {
    this.MaxMinValidation();
  }
  private MaxMinValidation(): void {
    let val = parseInt(this.ref.nativeElement.value);
    if (this.max !== null && this.max !== undefined && val >= this.max)
      this.directiveFormControl.setValue(this.max);
    else if (this.min !== null && this.min !== undefined && val <= this.min)
      this.directiveFormControl.setValue(this.min);
  }

}
