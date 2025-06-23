import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appIntegerOnly]'
})
export class IntegerOnlyDirective {
  @HostListener('beforeinput', ['$event'])
  public onInputChange(event: InputEvent): void {
    if (event.data && !/^\d+$/.test(event.data)) {
      event.preventDefault();
    }
  }
}
