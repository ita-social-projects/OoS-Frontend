import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { NavBarName } from '../../../shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from '../../../shared/enum/enumUA/no-results';
import { CompanyInformation } from '../../../shared/models/сompanyInformation.model';
import { NavigationBarService } from '../../../shared/services/navigation-bar/navigation-bar.service';
import { GetLawsAndRegulations } from '../../../shared/store/admin.actions';
import { AdminState } from '../../../shared/store/admin.state';
import { AddNavPath, DeleteNavPath } from '../../../shared/store/navigation.actions';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit, OnDestroy {
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
      new AddNavPath(this.navigationBarService.createOneNavPath({ name: NavBarName.LawsAndRegulations, isActive: false, disable: true }))
    );
    this.store.dispatch(new GetLawsAndRegulations());
    this.platformRules$.pipe(takeUntil(this.destroy$)).subscribe((rules: CompanyInformation) => (this.platformRules = rules));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
