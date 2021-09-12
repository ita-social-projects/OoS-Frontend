import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-status-info',
  templateUrl: './status-info.component.html',
  styleUrls: ['./status-info.component.scss']
})
export class StatusInfoComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  constructor() { }

  ngOnInit(): void {
  }


  openMyMenu() {
    this.trigger.openMenu();
  }
  closeMyMenu() {
    this.trigger.closeMenu();
  }
}