import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appMinMax]'
})
export class MinMaxDirective implements OnDestroy {

  @Input() public min: number;
  @Input() public max: number;
  @Input() public directiveFormControl: FormControl;
  @Input() debounce$: Subject<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(private ref: ElementRef) { }

  @HostListener('input', ['$event'])
  public onInput(event: InputEvent): void {
    this.debounce$.pipe(
      debounceTime(200)
    ).subscribe(() => this.MaxMinValidation());
  }

  public handleKeyboardEvent(event: KeyboardEvent): void {
    this.debounce$.pipe(
      debounceTime(200)
    ).subscribe(() => this.MaxMinValidation());
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

  ngOnDestroy(): void {
    this.debounce$.next(true);
    this.debounce$.unsubscribe();
  }
}
