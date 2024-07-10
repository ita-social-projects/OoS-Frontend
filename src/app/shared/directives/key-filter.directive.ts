import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appKeyFilter]'
})
export class KeyFilterDirective {
  @Input() public appKeyFilter: RegExp;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  public onInputChange(event: InputEvent): void {
    const initValue = this.el.nativeElement.value;

    this.el.nativeElement.value = initValue.replace(this.appKeyFilter, '');
    if (initValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
