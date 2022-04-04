import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { PaginationConstants } from 'src/app/shared/constants/constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Direction, DirectionsFilter } from 'src/app/shared/models/category.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { DeleteDirectionById, FilterChange, FilterClear, GetFilteredDirections, PageChange, SetSearchQueryValue } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { FilterState } from 'src/app/shared/store/filter.state';

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
  destroy$: Subject<boolean> = new Subject<boolean>();

  readonly noDirections = NoResultsTitle.noDirections;
  readonly itemsPerPage = PaginationConstants.ITEMS_PER_PAGE_TEN;

  searchValue = new FormControl('', [Validators.maxLength(200)]);
  searchedText: string;
  isEditMode: true;
  currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };

  constructor(
    private store: Store,
    private actions$: Actions,
    private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.store.dispatch([new FilterClear(), new GetFilteredDirections()]);
    this.searchValue.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: string) => {
        this.searchedText = val;
        if (val.length === 0) {
          this.store.dispatch(new SetSearchQueryValue(''));
        }
      });

    this.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe((text: string) => this.searchValue.setValue(text, {emitEvent: false}));

    this.actions$.pipe(ofAction(FilterChange))
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        startWith(''),
        takeUntil(this.destroy$)
      ).subscribe(() => this.store.dispatch(new GetFilteredDirections()));
  }

  onSearch(): void {
    this.store.dispatch(new SetSearchQueryValue(this.searchedText || ''));
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new PageChange(page));
  }

  onDelete(direction: Direction): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
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
