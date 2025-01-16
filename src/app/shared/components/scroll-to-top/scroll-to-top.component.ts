import { AfterViewInit, Component, HostListener, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AppState } from 'shared/store/app.state';
import { Constants } from 'shared/constants/constants';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from 'ngx-window-token';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public results: number;
  @Select(AppState.isMobileScreen)
  public isMobileView$: Observable<boolean>;
  public shouldBeSticky: boolean = false;
  public showScroll: boolean = false;
  public footerHeight: number;
  public isSmallScreen: boolean;
  private observer: ResizeObserver;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private renderer: Renderer2
  ) {}

  @HostListener('window:resize', [])
  public onResize(): void {
    this.checkScreenWidth();
  }

  @HostListener('window:scroll', ['$event'])
  public onScroll(): void {
    this.checkScroll();
    this.checkSticky();
  }

  public ngOnInit(): void {
    this.checkScreenWidth();
  }

  public ngAfterViewInit(): void {
    const footer = this.renderer.selectRootElement('app-footer', true);

    this.observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.footerHeight = entry.contentRect.height;
      });
    });

    this.observer.observe(footer);
  }

  public ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  public scrollToTop(): void {
    this.window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  private checkScroll(): void {
    const scrollPosition = this.window.scrollY || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    this.showScroll = scrollPosition >= Constants.SCROLL_TO_TOP_BUTTON_POS;
  }

  private checkSticky(): void {
    const scrollPosition = this.window.scrollY + this.window.innerHeight;
    const pageHeight = this.document.documentElement.scrollHeight;
    this.shouldBeSticky = pageHeight - scrollPosition > this.footerHeight;
  }

  private checkScreenWidth(): void {
    this.isSmallScreen = this.window.innerWidth < 840;
  }
}
