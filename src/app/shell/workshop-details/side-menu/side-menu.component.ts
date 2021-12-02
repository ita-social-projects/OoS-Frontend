import { Workshop } from 'src/app/shared/models/workshop.model';
import { Component, Input, OnInit } from '@angular/core';
import { Role } from 'src/app/shared/enum/role';
import { Select } from '@ngxs/store';
import { AppState } from 'src/app/shared/store/app.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  @Select(AppState.isMobileScreen) isMobileScreen$: Observable<boolean>;

  readonly Role: typeof Role = Role;
  @Input() role: string;
  @Input() workshop: Workshop;

  constructor() { }

  ngOnInit(): void { }
}
