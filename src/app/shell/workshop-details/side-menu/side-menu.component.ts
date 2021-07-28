import { Workshop } from 'src/app/shared/models/workshop.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  @Input() isDisplayedforProvider: boolean;
  @Input() isRegistered: boolean;
  @Input() workshop: Workshop;

  constructor() { }

  ngOnInit(): void { }
}
