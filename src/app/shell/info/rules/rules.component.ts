import { Component, OnInit } from '@angular/core';

import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { Select, Store } from '@ngxs/store';
import { GetLawsAndRegulations } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent implements OnInit {
  @Select(AdminState.LawsAndRegulations)
  platformRules$: CompanyInformation;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetLawsAndRegulations());
  }
}
