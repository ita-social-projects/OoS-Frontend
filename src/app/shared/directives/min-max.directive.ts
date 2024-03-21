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

  private debounce$: Subject<number> = new Subject<number>();

  constructor(private ref: ElementRef) {}

  @HostListener('input', ['$event'])
  public onInput(event: InputEvent): void {
    const value: number = this.ref.nativeElement.value;
    this.debounce$.next(value);
  }

  public ngOnInit(): void {
    this.debounce$.pipe(debounceTime(1000)).subscribe((value: number) => this.validate(value));
  }

  public ngOnDestroy(): void {
    this.debounce$.unsubscribe();
  }

  private validate(value: number): void {
    if (this.max !== null && this.max !== undefined && value >= this.max) {
      this.directiveFormControl.setValue(this.max);
    } else if (this.min !== null && this.min !== undefined && value <= this.min) {
      this.directiveFormControl.setValue(this.min);
    }
  }
}
