import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDigitOnly]'
})
export class DigitOnlyDirective {
  @HostListener('beforeinput', ['$event'])
  public onInputChange(event: InputEvent): void {
    if (event.data && /[^0-9./]/.test(event.data)) {
      event.preventDefault();
    }
  }
}
