import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isUnauthorized = false;
  user = {
    firstName: 'Іванов В. М'
  }

  constructor() { }

  ngOnInit(): void {
  }

}
