import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DeletePositionById, GetPositions } from 'shared/store/provider.actions';
import { Position, PositionParameters } from 'shared/models/position.model';
import { ProviderState } from 'shared/store/provider.state';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { Util } from 'shared/utils/utils';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { PushNavPath } from 'shared/store/navigation.actions';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, filter, Observable, takeUntil, tap } from 'rxjs';
import { SearchResponse } from 'shared/models/search.model';
import { FormControl } from '@angular/forms';
import { ValidationConstants } from 'shared/constants/validation';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-positions',
  templateUrl: './provider-positions.component.html',
  styleUrls: ['./provider-positions.component.scss']
})
export class ProviderPositionsComponent extends ProviderComponent implements OnInit {
  @ViewChild(MatSort) private readonly sort: MatSort;

  public displayedColumns: string[] = ['fullName', 'shortName', 'description', 'rate', 'tariff', 'seatsAmount', 'createdAt', 'action'];
  public dataSource: MatTableDataSource<Position> = new MatTableDataSource<Position>();
  public positions$: Observable<Position>;
  public totalElements = 0;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public readonly positionParameters: PositionParameters = { size: 12, providerId: '' };
  public isSmallMobileView: boolean;
  public readonly withoutSort: string = 'FORMS.PLACE_HOLDERS.WITHOUT_SORT';
  public readonly sortByName: string = 'FORMS.PLACE_HOLDERS.SORT_BY_NAME';
  public readonly sortByCreatedAt: string = 'FORMS.PLACE_HOLDERS.SORT_BY_CREATED_AT';
  public readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  public readonly ModeConstants = ModeConstants;
  public readonly validationConstants = ValidationConstants;
  public filterFormControl: FormControl = new FormControl('');
  public readonly sortList: string[] = [this.withoutSort, this.sortByName, this.sortByCreatedAt];
  public sortFormControl: FormControl = new FormControl(this.withoutSort);
  constructor(
    protected store: Store,
    protected matDialog: MatDialog
  ) {
    super(store, matDialog);
  }

  @HostListener('window: resize', ['$event.target'])
  public onResize(event: Window): void {
    this.isSmallMobileView = event.innerWidth <= 480;
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.sortFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: string) => this.sortData(value));

    this.filterFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
        tap((value: string) => {
          this.positionParameters.searchString = value;
          this.getPositions();
        })
      )
      .subscribe();
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
      console.error('Provider is undefined, cannot initialize positions.');
      return;
    }

    this.positionParameters.providerId = this.provider.id;
    this.getPositions();

    this.store
      .select(ProviderState.positions)
      .pipe(
        takeUntil(this.destroy$),
        filter((position: SearchResponse<Position[]>) => position != null)
      )
      .subscribe((positions: SearchResponse<Position[]>) => {
        this.dataSource.data = positions.entities;
        this.totalElements = positions.totalAmount;
      });
  }

  private sortData(value: string): void {
    if (value === this.sortByCreatedAt) {
      this.positionParameters.orderByCreatedAt = true;
      this.positionParameters.orderByFullName = false;
    } else if (value === this.sortByName) {
      this.positionParameters.orderByCreatedAt = false;
      this.positionParameters.orderByFullName = true;
    } else {
      this.positionParameters.orderByCreatedAt = true;
      this.positionParameters.orderByFullName = true;
    }
    this.getPositions();
  }

  private getPositions(): void {
    if (!this.provider) {
      console.error('Provider is undefined, cannot fetch positions.');
      return;
    }

    this.positionParameters.providerId = this.provider.id;
    Util.setFromPaginationParam(this.positionParameters, this.currentPage, this.totalElements);
    this.store.dispatch(new GetPositions(this.positionParameters));
  }
}
