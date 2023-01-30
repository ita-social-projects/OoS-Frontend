import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { SearchResponse } from '../../../../shared/models/search.model';
import { StatisticParameters, StatisticReport } from '../../../../shared/models/statistic.model';
import { AdminState } from '../../../../shared/store/admin.state';
import { GetStatisticReports } from '../../../../shared/store/admin.actions';
import { StatisticPeriodType, StatisticPeriodTitle, StatisticFileFormat } from '../../../../shared/enum/statistics';
import { PaginationConstants } from '../../../../shared/constants/constants';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { Util } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  readonly StatisticPeriodTitle = StatisticPeriodTitle;
  readonly StatisticPeriodType = StatisticPeriodType;
  readonly StatisticFileFormat = StatisticFileFormat;
  readonly noReports = NoResultsTitle.noResult;

  @Select(AdminState.statisticsReports)
  statisticReports$: Observable<SearchResponse<StatisticReport[]>>;

  statisticReports: SearchResponse<StatisticReport[]>;
  statisticParameters: StatisticParameters = {
    ReportDataType: null,
    ReportType: null,
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };
  filtersForm: FormGroup;
  displayedColumns = ['title', 'fileFormat', 'date', 'createDate', 'actions'];
  currentPage: PaginationElement = PaginationConstants.firstPage;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    Util.setFromPaginationParam(this.statisticParameters, this.currentPage);

    this.statisticReports$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((statisticReports: SearchResponse<StatisticReport[]>) => (this.statisticReports = statisticReports));

    this.filtersForm = this.fb.group({
      period: new FormControl(StatisticPeriodType.WorkshopsDaily),
      format: new FormControl(StatisticFileFormat.CSV)
    });

    this.setParams();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.statisticParameters.size = itemsPerPage;
    this.getReports();
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getReports();
  }

  onGenerateReport(): void {
    this.setParams();
    this.store.dispatch(new GetStatisticReports(this.statisticParameters));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private setParams(): void {
    this.statisticParameters.ReportDataType = this.filtersForm.get('format').value;
    this.statisticParameters.ReportType = this.filtersForm.get('period').value;
  }

  private getReports(): void {
    Util.setFromPaginationParam(this.statisticParameters, this.currentPage);
    this.store.dispatch(new GetStatisticReports(this.statisticParameters));
  }
}
