import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { OnPageChangeDirections, SetDirectionsPerPage } from 'src/app/shared/store/paginator.actions';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Direction, DirectionsFilter } from 'src/app/shared/models/category.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { DeleteDirectionById, FilterClear, GetFilteredDirections, SetSearchQueryValue } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss']
})
export class DirectionsComponent implements OnInit, OnDestroy {
  @Input() direction: Direction;

  @Select(AdminState.filteredDirections)
  filteredDirections$: Observable<DirectionsFilter>;
  @Select(AdminState.searchQuery)
  searchQuery$: Observable<string>;
  @Select(PaginatorState.directionsPerPage)
  directionsPerPage$: Observable<number>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  readonly noDirections = NoResultsTitle.noDirections;

  searchValue = new FormControl('', [Validators.maxLength(200)]);
  searchedText: string;
  isEditMode: true;
  currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };

  constructor(
    private store: Store,
    private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.store.dispatch([new FilterClear(), new GetFilteredDirections()]);
    this.searchValue.valueChanges
        .pipe(
          takeUntil(this.destroy$),
          debounceTime(1000),
          distinctUntilChanged(),
          startWith(''),
        ).subscribe((val: string) => {
        this.searchedText = val;
        if (!val) {
          this.store.dispatch(new SetSearchQueryValue(''));
        }
      });

    this.searchQuery$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe((text: string) => this.searchValue.setValue(text, {emitEvent: false}));
  }

  onSearch(): void {
    this.store.dispatch(new SetSearchQueryValue(this.searchedText || ''));
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new OnPageChangeDirections(page));
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetDirectionsPerPage(itemsPerPage), new GetFilteredDirections()]);
  }

  onDelete(direction: Direction): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteDirection,
        property: direction.title
      }
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
