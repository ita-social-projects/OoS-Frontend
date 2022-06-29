import { Select, Store } from '@ngxs/store';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { WorkshopFilterCard } from '../../../shared/models/workshop.model';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { FilterState } from 'src/app/shared/store/filter.state';
import { Role } from 'src/app/shared/enum/role';
import { OnPageChangeWorkshops } from 'src/app/shared/store/paginator.actions';
import { GetFilteredWorkshops } from 'src/app/shared/store/filter.actions';

@Component({
  selector: 'app-workshop-cards-list',
  templateUrl: './workshop-cards-list.component.html',
  styleUrls: ['./workshop-cards-list.component.scss']
})
export class WorkshopCardsListComponent implements OnInit, OnDestroy {

  readonly noResultWorkshops = NoResultsTitle.noResultWorkshops;
  readonly Role = Role;
  @Input() workshops$: Observable<WorkshopFilterCard>;
  @Input() currentPage: PaginationElement;
  @Input() role: string;
  @Input() itemsPerPage: number;

  @Output() itemsPerPageChange = new EventEmitter<Number>();

  isVisible = false;
  parent: boolean;
  @Select(FilterState.isLoading)
  isLoadingResultPage$: Observable<boolean>;
  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(public store: Store) { }

  ngOnInit(): void { }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new OnPageChangeWorkshops(page));
    this.store.dispatch(new GetFilteredWorkshops());
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
