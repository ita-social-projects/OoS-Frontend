import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appMinMax]'
})
export class MinMaxDirective implements OnInit, OnDestroy {

  @Input() public min: number;
  @Input() public max: number;
  @Input() public directiveFormControl: FormControl;

  debounce$: Subject<boolean> = new Subject<boolean>();

  constructor(private ref: ElementRef) { }

  ngOnInit(): void {
    this.debounce$.pipe(
      debounceTime(1000)
    ).subscribe(() => this.MaxMinValidation());
  }

  @HostListener('input', ['$event'])
  public onInput(event: InputEvent): void {
    this.debounce$.next();

  }

  public handleKeyboardEvent(event: KeyboardEvent): void {
    this.debounce$.next();
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
    this.debounce$.unsubscribe();
  }
}
