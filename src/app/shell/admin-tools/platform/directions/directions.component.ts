import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { OnPageChangeDirections, SetDirectionsPerPage } from 'src/app/shared/store/paginator.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, skip, startWith, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Direction, DirectionsFilter } from 'src/app/shared/models/category.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { AdminState } from 'src/app/shared/store/admin.state';
import { Constants, PaginationConstants } from 'src/app/shared/constants/constants';
import { PopNavPath } from 'src/app/shared/store/navigation.actions';
import { DeleteDirectionById, GetFilteredDirections } from 'src/app/shared/store/admin.actions';
@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
})
export class DirectionsComponent implements OnInit, OnDestroy {
  readonly noDirections = NoResultsTitle.noDirections;

  @Select(AdminState.filteredDirections)
  filteredDirections$: Observable<DirectionsFilter>;
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
    this.store.dispatch(new PopNavPath());
  }
}
