import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDigitOnly]'
})
export class DigitOnlyDirective {
  @Input() public price: boolean = false;

  @HostListener('beforeinput', ['$event'])
  public onInputChange(event: InputEvent): void {
    if (event.data && /[^0-9./]/.test(event.data)) {
      event.preventDefault();
    }

    const element = event.target as HTMLInputElement;

    if (event.data && this.price && element.value.includes('.') && /^\d+(\.\d{2})?$/.test(element.value)) {
      event.preventDefault();
    }
  }

  @HostListener('blur', ['$event'])
  public onLoseFocus(event: FocusEvent): void {
    if (!this.price) {
      return;
    }

    const element = event.target as HTMLInputElement;

    if (element.value) {
      element.value = Number.parseFloat(element.value).toFixed(2);
    }

    element.stepUp(0);
  }
}
