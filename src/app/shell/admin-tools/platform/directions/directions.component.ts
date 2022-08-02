import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { PopNavPath } from 'src/app/shared/store/navigation.actions';
@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
})
export class DirectionsComponent implements OnInit, OnDestroy {
  readonly noDirections = NoResultsTitle.noDirections;

  @Select(PaginatorState.directionsPerPage)
  directionsPerPage$: Observable<number>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  filterFormControl = new FormControl('', [Validators.maxLength(200)]);
  isEditMode: true;
  currentPage: PaginationElement = {
    element: 1,
    isActive: true,
  };

  constructor(private store: Store, private matDialog: MatDialog) {}

  ngOnInit(): void {}

  onPageChange(page: PaginationElement): void {}

  onItemsPerPageChange(itemsPerPage: number): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}
