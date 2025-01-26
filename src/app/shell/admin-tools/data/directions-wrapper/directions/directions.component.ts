import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, skip, startWith, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Direction, DirectionParameters } from 'shared/models/category.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { SearchResponse } from 'shared/models/search.model';
import { DeleteDirectionById, GetFilteredDirections } from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss']
})
export class DirectionsComponent implements OnInit, OnDestroy {
  @Select(AdminState.filteredDirections)
  public filteredDirections$: Observable<SearchResponse<Direction[]>>;

  public readonly noDirections = NoResultsTitle.noResult;
  public readonly ModeConstants = ModeConstants;

  public filterFormControl = new FormControl('', [Validators.maxLength(200)]);
  public isEditMode: true;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public totalAmount: number;
  public directionsParameters: DirectionParameters = {
    searchString: '',
    size: PaginationConstants.DIRECTIONS_PER_PAGE
  };

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private matDialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.getDirections();

    this.filterFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        startWith(''),
        skip(1),
        debounceTime(1000),
        takeUntil(this.destroy$),
        map((searchedText: string) => searchedText.trim())
      )
      .subscribe((searchedText: string) => {
        this.directionsParameters.searchString = searchedText;

        this.currentPage = PaginationConstants.firstPage;
        this.getDirections();
      });

    this.filteredDirections$
      .pipe(takeUntil(this.destroy$))
      .subscribe((directions: SearchResponse<Direction[]>) => (this.totalAmount = directions.totalAmount));
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getDirections();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.directionsParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public onDelete(direction: Direction): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteDirection,
        property: direction.title
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.store.dispatch(new DeleteDirectionById(direction.id, this.directionsParameters)));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getDirections(): void {
    Util.setFromPaginationParam(this.directionsParameters, this.currentPage, this.totalAmount);
    this.store.dispatch(new GetFilteredDirections(this.directionsParameters));
  }
}
