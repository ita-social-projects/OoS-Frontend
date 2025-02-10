import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationConstants } from 'shared/constants/validation';

@Component({
  selector: 'app-full-search-bar',
  templateUrl: './full-search-bar.component.html',
  styleUrls: ['./full-search-bar.component.scss']
})
export class FullSearchBarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('validationHint', { read: ElementRef }) public validationHint: ElementRef;
  @Input() public styleClass: string;
  public displayErrorFormControl: FormControl = new FormControl();

  public readonly validationConstants = ValidationConstants;
  public tooltipText: string = '';

  private mutationObserver: MutationObserver | null = null;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  public setErrorFormControl(searchBarFormControl: FormControl): void {
    this.displayErrorFormControl = searchBarFormControl;
  }

  public ngAfterViewInit(): void {
    if (!this.validationHint?.nativeElement) {
      return;
    }

    const element = this.validationHint.nativeElement;
    this.mutationObserver = new MutationObserver(() => {
      const text = element.textContent;
      this.tooltipText = text;
      this.cdr.markForCheck();
    });

    this.mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  public ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }
}
