import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { Role } from 'src/app/shared/enum/role';
import { Application, ApplicationCards, ApplicationParameters } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { OnPageChangeApplications, SetApplicationsPerPage } from 'src/app/shared/store/paginator.actions';
import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { GetApplicationsByParentId } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-child-workshops-list',
  templateUrl: './child-workshops-list.component.html',
  styleUrls: ['./child-workshops-list.component.scss'],
})
export class ChildWorkshopsListComponent implements OnInit, OnDestroy, OnChanges {
  readonly constants = Constants;
  readonly Role = Role;

  @Input() child: Child;
  @Input() statuses: ApplicationStatus[];

  @Output() leaveWorkshop = new EventEmitter();

  @Select(PaginatorState.applicationsPerPage)
  applicationsPerPage$: Observable<number>;
  @Select(UserState.applications)
  applicationCards$: Observable<ApplicationCards>;
  applicationCards: ApplicationCards;

  destroy$: Subject<boolean> = new Subject<boolean>();
  currentPage: PaginationElement = {
    element: 1,
    isActive: true,
  };

  constructor(private store: Store) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.statuses?.currentValue) {
      this.getChildApplications();
    }
  }

  ngOnInit(): void {
    this.applicationCards$
      .pipe(
        filter((applicationCards: ApplicationCards) => !!applicationCards),
        takeUntil(this.destroy$)
      )
      .subscribe((applicationCards: ApplicationCards) => {
        this.applicationCards = applicationCards;
      });
  }

  /**
   * This method get parent children and applications to display workshops
   */
  getChildApplications(): void {
    const params: ApplicationParameters = {
      showBlocked: false,
      children: [this.child.id],
      statuses: this.statuses,
      workshops: [],
      size: 4,
    };
    this.store.dispatch(new GetApplicationsByParentId(this.child.parent.id, params));
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new OnPageChangeApplications(page));
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch(new SetApplicationsPerPage(itemsPerPage));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
