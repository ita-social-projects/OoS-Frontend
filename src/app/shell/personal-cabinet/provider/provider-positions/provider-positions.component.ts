import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Store } from '@ngxs/store';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs';

import { ProviderState } from 'shared/store/provider.state';
import { DeletePositionById, GetPositions } from 'shared/store/provider.actions';
import { PushNavPath } from 'shared/store/navigation.actions';
import { Position, PositionParameters } from 'shared/models/position.model';
import { SearchResponse } from 'shared/models/search.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { ValidationConstants } from 'shared/constants/validation';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { Util } from 'shared/utils/utils';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-positions',
  templateUrl: './provider-positions.component.html',
  styleUrls: ['./provider-positions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProviderPositionsComponent extends ProviderComponent implements OnInit {
  public readonly debounceInputTime = 500;
  public readonly positionParameters: PositionParameters = { size: 12, providerId: '', order: false };
  public readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  public readonly ModeConstants = ModeConstants;
  public readonly validationConstants = ValidationConstants;
  public readonly NoResultsTitle = NoResultsTitle;
  public displayedColumns: string[] = ['fullName', 'shortName', 'description', 'rate', 'tariff', 'seatsAmount', 'createdAt', 'actions'];
  public dataSource: MatTableDataSource<Position> = new MatTableDataSource<Position>();
  public totalElements = 0;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public filterFormControl: FormControl = new FormControl('');

  constructor(
    protected readonly store: Store,
    protected readonly matDialog: MatDialog,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(store, matDialog);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.filterFormControl.valueChanges
      .pipe(debounceTime(this.debounceInputTime), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((filterString: string) => {
        this.positionParameters.searchString = filterString;
        this.getPositions();
      });
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.positionParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getPositions();
  }

  public onDelete(position: Position): void {
    this.store.dispatch(new DeletePositionById(this.positionParameters, position.id));
  }

  public addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Positions,
        isActive: false,
        disable: true
      })
    );
  }

  public initProviderData(): void {
    if (!this.provider) {
      return;
    }

    this.positionParameters.providerId = this.provider.id;
    this.getPositions();

    this.store
      .select(ProviderState.positions)
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((positions: SearchResponse<Position[]>) => {
        this.dataSource.data = positions.entities;
        this.totalElements = positions.totalAmount;
        this.cdr.markForCheck();
      });
  }

  public sortData(sortData: Sort): void {
    this.positionParameters.filterByProperty = sortData.active;
    this.positionParameters.order = sortData.direction === 'asc';
    if (sortData.direction) {
      this.getPositions();
    }
  }

  private getPositions(): void {
    if (!this.provider) {
      return;
    }

    this.positionParameters.providerId = this.provider.id;
    Util.setFromPaginationParam(this.positionParameters, this.currentPage, this.totalElements);
    this.store.dispatch(new GetPositions(this.positionParameters));
  }
}
