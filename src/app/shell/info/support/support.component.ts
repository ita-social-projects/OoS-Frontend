import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { CompanyInformation } from 'shared/models/company-information.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { GetSupportInformation } from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';
import { AddNavPath, DeleteNavPath } from 'shared/store/navigation.actions';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit, OnDestroy {
  @Select(AdminState.supportInformation)
  public platformSupport$: Observable<CompanyInformation>;
  @Select(AdminState.isLoading)
  public isLoading$: Observable<boolean>;

  public readonly noData = NoResultsTitle.noInfo;

  public platformSupport: CompanyInformation;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    public navigationBarService: NavigationBarService
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(
      new AddNavPath(this.navigationBarService.createOneNavPath({ name: NavBarName.SupportInformation, isActive: false, disable: true }))
    );
    this.store.dispatch(new GetSupportInformation());
    this.platformSupport$.pipe(takeUntil(this.destroy$)).subscribe((support: CompanyInformation) => (this.platformSupport = support));
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
