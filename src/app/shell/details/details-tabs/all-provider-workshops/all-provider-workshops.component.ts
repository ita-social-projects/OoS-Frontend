import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { PaginationConstants } from 'shared/constants/constants';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { Role } from 'shared/enum/role';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { ProviderParameters } from 'shared/models/provider.model';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCard } from 'shared/models/workshop.model';
import { GetWorkshopsByProviderId } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-all-provider-workshops',
  templateUrl: './all-provider-workshops.component.html',
  styleUrls: ['./all-provider-workshops.component.scss']
})
export class AllProviderWorkshopsComponent implements OnInit, OnDestroy {
  @Input() public providerParameters: ProviderParameters;

  @Select(SharedUserState.workshops)
  public workshops$: Observable<SearchResponse<WorkshopCard[]>>;

  public readonly noResultWorkshops = NoResultsTitle.noResult;
  public readonly Role = Role;

  public workshops: SearchResponse<WorkshopCard[]>;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.getWorkshops();

    this.workshops$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((workshops: SearchResponse<WorkshopCard[]>) => (this.workshops = workshops));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getWorkshops();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.providerParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  private getWorkshops(): void {
    Util.setFromPaginationParam(this.providerParameters, this.currentPage, this.workshops?.totalAmount);
    this.store.dispatch(new GetWorkshopsByProviderId(this.providerParameters));
  }
}
