import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ToggleMobileScreen } from './shared/store/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(public store: Store) { }

  isMobileView: boolean;

  /**
   *@param event global variable window
   * method defined window.width and assign isMobileView: boolean
   */

  isWindowMobile(event: any): void {
    this.isMobileView = event.innerWidth <= 750;
    this.store.dispatch(new ToggleMobileScreen(this.isMobileView));
  }

  @HostListener('window: resize', ['$event.target'])
  onResize(event: any): void {
    this.isWindowMobile(event);
  }

  ngOnInit(): void {
    this.isWindowMobile(window);
  }
}
