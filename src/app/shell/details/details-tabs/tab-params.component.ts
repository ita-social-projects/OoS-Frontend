import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WINDOW } from 'ngx-window-token';

@Component({
  selector: 'app-tab-params',
  template: ''
})
export abstract class TabParamsComponent implements OnInit, OnDestroy {
  public tabs: { alias: string; labelKey: string; visible: boolean }[];
  public selectedIndex: number = 0;

  protected destroy$: Subject<boolean> = new Subject<boolean>();

  protected constructor(
    @Inject(WINDOW) protected window: Window,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  public ngOnInit(): void {
    this.initTabs();

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      const tabIndex = this.tabs.findIndex((tab) => tab.alias === params.tab);
      this.selectedIndex = tabIndex !== -1 ? tabIndex : 0;
      this.onTabChange({ index: this.selectedIndex } as MatTabChangeEvent);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public onAnimationDone(): void {
    // fixes carousel if it's inside the tab
    if (this.selectedIndex === this.tabs.findIndex((tab) => tab.alias === 'Images')) {
      requestAnimationFrame(() => this.window.dispatchEvent(new Event('resize')));
    }
  }

  public onTabChange(event: MatTabChangeEvent): void {
    const alias = this.tabs[event.index]?.alias;
    this.router.navigate([], {
      queryParams: { tab: alias },
      replaceUrl: true
    });
  }

  protected abstract initTabs(): void;
}
