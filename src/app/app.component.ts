import { Component, HostListener, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ToggleMobileScreen } from './shared/store/app.actions';
import { AppState } from './shared/store/app.state';
import { FilterState } from './shared/store/filter.state';
import { GetFeaturesList } from './shared/store/meta-data.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(public store: Store) { }

  isMobileView: boolean;

  /**
   * @param event global variable window
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
    this.store.dispatch(new GetFeaturesList());
  }
}
