import {
  AddNavPath,
  DeleteNavPath,
} from 'src/app/shared/store/navigation.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';

import { AdminState } from 'src/app/shared/store/admin.state';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { GetAboutPortal } from 'src/app/shared/store/admin.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { takeUntil } from 'rxjs/operators';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, OnDestroy {
  @Select(AdminState.AboutPortal)
  platformInformation$: Observable<CompanyInformation>;
  @Select(AdminState.isLoading)
  isLoading$: Observable<boolean>;

  platformInformation: CompanyInformation;

  readonly emptyList = NoResultsTitle.noInfo;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, private navigationBarService: NavigationBarService) {}

  ngOnInit(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createOneNavPath({ name: NavBarName.AboutPortal, isActive: false, disable: true })
      )
    );
    this.store.dispatch(new GetAboutPortal());
    this.platformInformation$.pipe(takeUntil(this.destroy$)).subscribe(
      (info: CompanyInformation) => this.platformInformation = info
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
