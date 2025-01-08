import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-result-to-top-btn',
  templateUrl: './result-to-top-btn.component.html',
  styleUrls: ['./result-to-top-btn.component.scss']
})
export class ResultToTopBtnComponent implements OnInit {
  @Input() public results: number;
  public isSmallScreen: boolean;

  @HostListener('window:resize', [])
  private onResize(): void {
    this.checkScreenWidth();
  }

  public ngOnInit(): void {
    this.checkScreenWidth();
  }

  public scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  private checkScreenWidth(): void {
    this.isSmallScreen = window.innerWidth < 840;
  }
}
