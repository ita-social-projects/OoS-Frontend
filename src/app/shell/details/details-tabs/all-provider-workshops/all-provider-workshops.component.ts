import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { PaginationConstants } from '../../../../shared/constants/constants';
import { ProviderParameters } from '../../../../shared/models/provider.model';
import { GetWorkshopsByProviderId } from '../../../../shared/store/shared-user.actions';
import { Util } from '../../../../shared/utils/utils';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { Role } from '../../../../shared/enum/role';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { SearchResponse } from '../../../../shared/models/search.model';
import { Workshop, WorkshopCard } from '../../../../shared/models/workshop.model';
import { SharedUserState } from '../../../../shared/store/shared-user.state';

@Component({
  selector: 'app-all-provider-workshops',
  templateUrl: './all-provider-workshops.component.html',
  styleUrls: ['./all-provider-workshops.component.scss']
})
export class AllProviderWorkshopsComponent implements OnInit, OnDestroy {
  readonly noResultWorkshops = NoResultsTitle.noResult;
  readonly Role = Role;

  @Input() providerParameters: ProviderParameters;

  @Select(SharedUserState.workshops)
  workshops$: Observable<SearchResponse<WorkshopCard[]>>;
  workshops: SearchResponse<WorkshopCard[]>;

  currentPage: PaginationElement = PaginationConstants.firstPage;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Output() onGetWorkshops = new EventEmitter<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    const workshopsPerPage = PaginationConstants.WORKSHOPS_PER_PAGE;
    Util.setPaginationParams(this.providerParameters, this.currentPage, workshopsPerPage);

    this.getWorkshops();

    this.workshops$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((workshops: SearchResponse<WorkshopCard[]>) => (this.workshops = workshops));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getWorkshops(): void {
    this.store.dispatch(new GetWorkshopsByProviderId(this.providerParameters));
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    Util.setPaginationParams(this.providerParameters, this.currentPage, this.providerParameters.size);
    this.getWorkshops();
  }

  onItemsPerPageChange(itemPerPage: number) {
    Util.setPaginationParams(this.providerParameters, this.currentPage, itemPerPage);
    this.getWorkshops();
  }
}
