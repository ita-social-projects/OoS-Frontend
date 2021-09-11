import { Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  constructor() { }

  MobileView: boolean = false;

  /**
  * @param event global variable window
  * method defined window.width and assign MobileView: boolean
  */

  isWindowMobile(event: any): void {
    this.MobileView = event.innerWidth <= 750;
  }

  @HostListener("window: resize", ["$event.target"])
  onResize(event: any): void {
    this.isWindowMobile(event);
  }

  ngOnInit(): void {
    this.isWindowMobile(window);
  }
}



