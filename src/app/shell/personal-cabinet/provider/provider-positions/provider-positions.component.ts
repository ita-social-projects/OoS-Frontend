import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions, Store } from '@ngxs/store';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DeletePositionById, GetPositions } from 'shared/store/provider.actions';
import { Position, PositionParameters } from 'shared/models/position.model';
import { ProviderState } from 'shared/store/provider.state';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { Util } from 'shared/utils/utils';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { PushNavPath } from 'shared/store/navigation.actions';
import { MatDialog } from '@angular/material/dialog';
import { Observable, takeUntil } from 'rxjs';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-positions',
  templateUrl: './provider-positions.component.html',
  styleUrls: ['./provider-positions.component.scss']
})
export class ProviderPositionsComponent extends ProviderComponent implements OnInit {
  @ViewChild(MatSort) private readonly sort: MatSort;

  public displayedColumns: string[] = ['fullName', 'shortName', 'description', 'rate', 'tariff', 'typeByClassifier', 'action'];
  public dataSource: MatTableDataSource<Position> = new MatTableDataSource<Position>();
  public positions$: Observable<Position>;
  public totalElements = 0;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public readonly positionParameters: PositionParameters = { size: 12, providerId: '' };

  public readonly ModeConstants = ModeConstants;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private readonly actions$: Actions
  ) {
    super(store, matDialog);
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
        name: NavBarName.Workshops,
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((positions: Position[]) => {
        this.dataSource.data = positions;
        this.totalElements = positions?.length;
      });
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
