import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Constants } from 'src/app/shared/constants/constants';


@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit {

  showScrollButton: boolean;
  readonly constants: typeof Constants = Constants;

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollButton = (scrollPosition >= this.constants.SCROLL_TO_TOP_BUTTON_POS) ? true : false;
  }

  scrolltoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  constructor(private store: Store) { }

  ngOnInit(): void {
  }
}

