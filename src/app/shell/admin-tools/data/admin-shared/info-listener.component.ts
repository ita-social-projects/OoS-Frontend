import { Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  template: ''
})
export abstract class InfoListenerComponent implements OnDestroy {
  @Input() public height$: BehaviorSubject<number> = new BehaviorSubject<number>(400);

  public destroy$: Subject<void> = new Subject();

  protected tableHeightSubscription: Subscription;

  protected constructor(protected renderer: Renderer2) {}

  @ViewChild('tabGroup', { read: ElementRef })
  public set tabGroup(tabGroup: ElementRef) {
    if (!tabGroup) {
      return;
    }

    this.tableHeightSubscription.unsubscribe();
    this.tableHeightSubscription = this.height$.pipe(takeUntil(this.destroy$)).subscribe((height: number) => {
      const tab = tabGroup.nativeElement.querySelector('.mat-mdc-tab-body-wrapper') as HTMLElement;
      this.renderer.setStyle(tab, 'max-height', height > 400 ? `${height}px` : '400px');
      this.renderer.setStyle(tab, 'overflow', 'auto');
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
