import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { CompanyInformation } from 'shared/models/company-information.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { GetAboutPortal } from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';
import { AddNavPath, DeleteNavPath } from 'shared/store/navigation.actions';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  readonly noData = NoResultsTitle.noInfo;

  @Select(AdminState.AboutPortal)
  platformInformation$: Observable<CompanyInformation>;
  @Select(AdminState.isLoading)
  isLoading$: Observable<boolean>;

  platformInformation: CompanyInformation;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, private navigationBarService: NavigationBarService) {}

  ngOnInit(): void {
    this.store.dispatch(
      new AddNavPath(this.navigationBarService.createOneNavPath({ name: NavBarName.AboutPortal, isActive: false, disable: true }))
    );
    this.store.dispatch(new GetAboutPortal());
    this.platformInformation$.pipe(takeUntil(this.destroy$)).subscribe((info: CompanyInformation) => (this.platformInformation = info));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
