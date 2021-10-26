import { Workshop } from 'src/app/shared/models/workshop.model';
import { Component, Input, OnInit } from '@angular/core';
import { Role } from 'src/app/shared/enum/role';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  readonly Role: typeof Role = Role;
  @Input() role: string;
  @Input() workshop: Workshop;

  constructor() { }

  ngOnInit(): void { }
}
