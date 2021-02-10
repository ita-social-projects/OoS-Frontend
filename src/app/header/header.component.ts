import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { RegistrationComponent } from '../shared/modals/registration/registration.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuthorized = false;

  constructor(private modalDialog: MatDialog) { }

  ngOnInit(): void {
  }
  openModal() {
    this.modalDialog.open(RegistrationComponent);
  }
  

}
