import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appMinMax]'
})
export class MinMaxDirective implements OnInit, OnDestroy {

  @Input() public min: number;
  @Input() public max: number;
  @Input() public directiveFormControl: FormControl;

  debounce$: Subject<number> = new Subject<number>();

  constructor(private ref: ElementRef) { }

  ngOnInit(): void {
    this.debounce$.pipe(debounceTime(1000)).subscribe((val: number) => this.MaxMinValidation(val));
  }

  @HostListener('input', ['$event'])
  public onInput(event: InputEvent): void {
    const val = Number(this.ref.nativeElement.value);
    this.debounce$.next(val);
  }

  private MaxMinValidation(val: number): void {
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
