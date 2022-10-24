import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, skip, startWith, takeUntil } from 'rxjs/operators';
import { SearchResponse } from '../../../../../shared/models/search.model';
import { ConfirmationModalWindowComponent } from '../../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { PaginationConstants, Constants } from '../../../../../shared/constants/constants';
import { ModalConfirmationType } from '../../../../../shared/enum/modal-confirmation';
import { NoResultsTitle } from '../../../../../shared/enum/no-results';
import { Direction } from '../../../../../shared/models/category.model';
import { PaginationElement } from '../../../../../shared/models/paginationElement.model';
import { GetFilteredDirections, DeleteDirectionById } from '../../../../../shared/store/admin.actions';
import { AdminState } from '../../../../../shared/store/admin.state';
import { PopNavPath } from '../../../../../shared/store/navigation.actions';
import { OnPageChangeDirections, SetDirectionsPerPage } from '../../../../../shared/store/paginator.actions';
import { PaginatorState } from '../../../../../shared/store/paginator.state';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
})
export class DirectionsComponent implements OnInit, OnDestroy {
  readonly noDirections = NoResultsTitle.noDirections;

  @Select(AdminState.filteredDirections)
    filteredDirections$: Observable<SearchResponse<Direction[]>>;
  @Select(PaginatorState.directionsPerPage)
    directionsPerPage$: Observable<number>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  filterFormControl = new FormControl('', [Validators.maxLength(200)]);
  isEditMode: true;
  currentPage: PaginationElement = PaginationConstants.firstPage;

  constructor(private store: Store, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch([new OnPageChangeDirections(PaginationConstants.firstPage), new GetFilteredDirections()]);
    this.filterFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        startWith(''),
        skip(1),
        debounceTime(1000),
        map((searchedText: string) => searchedText.trim())
      )
      .subscribe((searchedText: string) => {
        this.store.dispatch(new GetFilteredDirections(searchedText));
      });
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeDirections(page), new GetFilteredDirections()]);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetDirectionsPerPage(itemsPerPage), new GetFilteredDirections()]);
  }

  onDelete(direction: Direction): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteDirection,
        property: direction.title,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.store.dispatch(new DeleteDirectionById(direction.id));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
