import { Component, HostListener, OnInit } from '@angular/core';
import { Constants } from '../../constants/constants';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit {
  public showScrollButton: boolean;
  public readonly constants: typeof Constants = Constants;

  @HostListener('window:scroll')
  public checkScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollButton = scrollPosition >= this.constants.SCROLL_TO_TOP_BUTTON_POS ? true : false;
  }

  public scrolltoTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  constructor() {}

  public ngOnInit(): void {}
}
