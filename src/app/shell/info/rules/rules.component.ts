import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { AdminState } from 'src/app/shared/store/admin.state';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { GetLawsAndRegulations } from 'src/app/shared/store/admin.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})

export class RulesComponent implements OnInit, OnDestroy  {
  @Select(AdminState.LawsAndRegulations)
  platformRules$: Observable<CompanyInformation>;

  constructor(private store: Store, private navigationBarService: NavigationBarService) {}

  ngOnInit(): void {
    this.store.dispatch([
      this.navigationBarService.createOneNavPath({
        name: NavBarName.LawsAndRegulations,
        isActive: false,
        disable: true,
      }),
      new GetLawsAndRegulations(),
    ]);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
