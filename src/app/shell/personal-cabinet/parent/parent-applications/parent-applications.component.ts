import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ChildDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { ChildCards } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { PopNavPath } from 'src/app/shared/store/navigation.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { GetAllUsersChildren, GetApplicationsByParentId } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { ApplicationsComponent } from '../../shared-cabinet/applications.component';

@Component({
  selector: 'app-parent-applications',
  templateUrl: './parent-applications.component.html',
  styleUrls: ['./parent-applications.component.scss'],
})
export class ParentApplicationsComponent extends ApplicationsComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly ChildDeclination = ChildDeclination;

  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  parent: Parent;
  @Select(UserState.children)
  childrenCards$: Observable<ChildCards>;
  childrenCards: ChildCards;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    protected router: Router,
    protected route: ActivatedRoute,
    protected actions$: Actions
  ) {
    super(store, matDialog, router, route, actions$);
  }

  init(): void {
    super.init();
    this.parent$
      .pipe(
        filter((parent: Parent) => !!parent),
        takeUntil(this.destroy$)
      )
      .subscribe((parent: Parent) => {
        this.parent = parent;
        this.getApplications();
        this.getParentChildren();
      });
  }

  protected getApplications(): void {
    this.store.dispatch(new GetApplicationsByParentId(this.parent.id, this.applicationParams));
  }

  private getParentChildren(): void {
    this.store.dispatch(new GetAllUsersChildren());
  }

  /**
   * This applies selected IDs as filtering parameter to get list of applications
   * @param IDs: string[]
   */
  onEntitiesSelect(IDs: string[]): void {
    this.applicationParams.children = IDs;
    this.getApplications();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(new PopNavPath());
  }
}
