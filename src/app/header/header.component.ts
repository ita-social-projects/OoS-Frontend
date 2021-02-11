import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { RegistrationComponent } from '../shared/modals/registration/registration.component';
import { Select } from '@ngxs/store';
import { AppState } from '../shared/store/app.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuthorized: boolean=false;
  @Select(AppState.isAuthorized)
  isAuthorized$: Observable<string[]>;

  constructor(private modalDialog: MatDialog) { }

  ngOnInit(): void {
  }
  openModal() {
    console.log(this.isAuthorized)
    this.modalDialog.open(RegistrationComponent);
  }
  

}
