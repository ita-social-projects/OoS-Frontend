import { Component, HostListener, OnInit} from '@angular/core';
import { Store } from '@ngxs/store';
import { ToggleMobileScreen } from './shared/store/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  constructor(public store: Store) { }

  MobileView: boolean;

  /**
  * @param event global variable window
  * method defined window.width and assign MobileView: boolean
  */

  isWindowMobile(event: any): void {
    this.MobileView = event.innerWidth <= 750;
    this.store.dispatch(new ToggleMobileScreen(this.MobileView))
  }

  @HostListener("window: resize", ["$event.target"])
  onResize(event: any): void {
    this.isWindowMobile(event);
  }

  ngOnInit(): void {
    this.isWindowMobile(window);
  }
}



