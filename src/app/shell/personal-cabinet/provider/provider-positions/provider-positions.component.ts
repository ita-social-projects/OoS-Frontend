import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { GetPositions } from 'shared/store/provider.actions';
import { Position, PositionParameters } from 'shared/models/position.model';
import { ProviderState } from 'shared/store/provider.state';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { PaginationConstants } from 'shared/constants/constants';
import { Util } from 'shared/utils/utils';
import { ModeConstants } from 'shared/constants/constants';

@Component({
  selector: 'app-provider-positions',
  templateUrl: './provider-positions.component.html',
  styleUrls: ['./provider-positions.component.scss']
})
export class ProviderPositionsComponent implements OnInit {
  @ViewChild(MatSort) private readonly sort: MatSort;

  public displayedColumns: string[] = ['fullName', 'shortName', 'description', 'rate', 'tariff', 'typeByClassifier', 'action'];
  public dataSource: MatTableDataSource<Position> = new MatTableDataSource<Position>();
  public totalElements = 0;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public readonly positionParameters: PositionParameters = { size: 12, providerId: '5' };

  public readonly ModeConstants = ModeConstants;
  constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.getPositions();
    this.store.select(ProviderState.positions).subscribe((positions: Position[]) => {
      this.dataSource.data = positions;
      this.dataSource.sort = this.sort;
      this.totalElements = positions.length;
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

  public onView(position: Position): void {
    console.log('View position:', position);
  }

  public onEdit(position: Position): void {
    console.log('Edit position:', position);
  }

  public onDelete(position: Position): void {
    console.log('Delete position:', position);
  }

  private getPositions(): void {
    Util.setFromPaginationParam(this.positionParameters, this.currentPage, this.totalElements);
    this.store.dispatch(new GetPositions(this.positionParameters));
  }
}
