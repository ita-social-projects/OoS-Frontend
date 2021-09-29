import { Select, Store } from '@ngxs/store';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { PageChange } from 'src/app/shared/store/filter.actions';
import { WorkshopFilterCard } from '../../../shared/models/workshop.model';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { FilterState } from 'src/app/shared/store/filter.state';
import { Util } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-workshop-cards-list',
  templateUrl: './workshop-cards-list.component.html',
  styleUrls: ['./workshop-cards-list.component.scss']
})
export class WorkshopCardsListComponent implements OnInit, OnDestroy {

  readonly noResultWorkshops = NoResultsTitle.noResultWorkshops;
  @Input() workshops: WorkshopFilterCard;

  isVisible = false;
  parent: boolean;
  currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };

  @Select(RegistrationState.parent)
  isParent$: Observable<boolean>;
  @Select(FilterState.isLoading)
  isLoadingResultPage$: Observable<boolean>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  workshopsCopy: any;
  @ViewChild('WorkshopsWrap') workshopsWrap: ElementRef;
  emptyItems = Util.emptyItems;

  constructor(public store: Store) { }

  ngOnInit(): void {

    this.isParent$
      .pipe(takeUntil(this.destroy$))
      .subscribe(parent => this.parent = parent);
  }

  onPageChange(page: PaginationElement): void {
    console.log("WORKSHOPS", this.workshops)
    this.currentPage = page;
    this.store.dispatch(new PageChange(page));
    console.log("Workshops", this.workshops)
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
