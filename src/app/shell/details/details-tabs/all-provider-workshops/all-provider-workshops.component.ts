import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { Role } from '../../../../shared/enum/role';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { SearchResponse } from '../../../../shared/models/search.model';
import { Workshop, WorkshopCard } from '../../../../shared/models/workshop.model';
import { OnPageChangeWorkshops, SetWorkshopsPerPage } from '../../../../shared/store/paginator.actions';
import { PaginatorState } from '../../../../shared/store/paginator.state';
import { SharedUserState } from '../../../../shared/store/shared-user.state';

@Component({
  selector: 'app-all-provider-workshops',
  templateUrl: './all-provider-workshops.component.html',
  styleUrls: ['./all-provider-workshops.component.scss']
})
export class AllProviderWorkshopsComponent implements OnInit, OnDestroy {
  readonly noResultWorkshops = NoResultsTitle.noResult;
  readonly Role = Role;

  @Input() workshop: Workshop;

  @Select(SharedUserState.workshops)
  workshops$: Observable<SearchResponse<WorkshopCard[]>>;
  workshops: SearchResponse<WorkshopCard[]>;
  @Select(PaginatorState.workshopsPerPage)
  workshopsPerPage$: Observable<number>;
  @Select(PaginatorState.currentPage)
  currentPage$: Observable<PaginationElement>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Output() onGetWorkshops = new EventEmitter<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.workshops$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((workshops: SearchResponse<WorkshopCard[]>) => (this.workshops = workshops));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onPageChange(page: PaginationElement): void {
    this.store
      .dispatch(new OnPageChangeWorkshops(page))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onGetWorkshops.emit());
  }

  onItemsPerPageChange(itemPerPage: number) {
    this.store
      .dispatch(new SetWorkshopsPerPage(itemPerPage))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onGetWorkshops.emit());
  }
}
