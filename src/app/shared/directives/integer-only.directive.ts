import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appIntegerOnly]'
})
export class IntegerOnlyDirective {
  @HostListener('beforeinput', ['$event'])
  public onBeforeInput(event: InputEvent): void {
    if (event.data && this.testInput(event.data)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  public onPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text');

    if (this.testInput(pastedText)) {
      event.preventDefault();
      this.setCleanValue(event.target as HTMLInputElement, pastedText);
    }
  }

  private testInput(value: string): boolean {
    return !/^\d+$/.test(value);
  }

  private setCleanValue(input: HTMLInputElement, value: string): void {
    const cleanedValue = value.replace(/\D/g, '');

    if (input.value !== cleanedValue) {
      input.value = cleanedValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
