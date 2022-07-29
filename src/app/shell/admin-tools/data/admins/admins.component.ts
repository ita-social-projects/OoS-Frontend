import { Component, OnInit } from '@angular/core';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  readonly noProviderAdmins = NoResultsTitle.noAdmins;

  constructor() { }

  ngOnInit(): void {
  }

}
