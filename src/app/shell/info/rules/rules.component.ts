import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';

import { AdminState } from 'src/app/shared/store/admin.state';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { GetLawsAndRegulations } from 'src/app/shared/store/admin.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { takeUntil } from 'rxjs/operators';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})

export class RulesComponent implements OnInit, OnDestroy  {
  readonly noData = NoResultsTitle.noInfo;

  @Select(AdminState.LawsAndRegulations)
  platformRules$: Observable<CompanyInformation>;
  @Select(AdminState.isLoading)
  isLoading$: Observable<boolean>;

  platformRules: CompanyInformation;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, private navigationBarService: NavigationBarService) {}

  ngOnInit(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createOneNavPath({ name: NavBarName.LawsAndRegulations, isActive: false, disable: true })
      )
    );
    this.store.dispatch(new GetLawsAndRegulations());
    this.platformRules$.pipe(takeUntil(this.destroy$)).subscribe(
      (rules: CompanyInformation) => this.platformRules = rules
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
