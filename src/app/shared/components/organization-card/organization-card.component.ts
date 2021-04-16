import { Component, Input, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Workshop } from '../../models/workshop.model';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-organization-card',
  templateUrl: './organization-card.component.html',
  styleUrls: ['./organization-card.component.scss']
})
export class OrganizationCardComponent implements OnInit {

  @Select(AppState.isMainPage)
  isMainPage$: Observable<boolean>;
  @Input() card: Workshop;

  constructor() { }

  ngOnInit(): void {
  }

}
