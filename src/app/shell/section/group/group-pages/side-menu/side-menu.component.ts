import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideMenuComponent {

  constructor() {
  }


  date : any;

  ngOnInit() {
  }


  dateClass = (d: Date) => {
    const date = d.getDay();
    // Highlight saturday and sunday.
    return (date === 0 || date === 6) ? 'highlight-dates' : undefined;
  }
}




