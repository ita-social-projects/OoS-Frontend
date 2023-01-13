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
import { OnPageChangeReports, SetReportsPerPage } from '../../../../shared/store/paginator.actions';
import { PaginatorState } from '../../../../shared/store/paginator.state';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  readonly StatisticPeriodTitle = StatisticPeriodTitle;
  readonly StatisticPeriodType = StatisticPeriodType;
  readonly StatisticFileFormat = StatisticFileFormat;

  @Select(AdminState.statisticsReports)
  statisticReports$: Observable<SearchResponse<StatisticReport[]>>;
  @Select(PaginatorState.reportsPerPage)
  reportsPerPage$: Observable<number>;

  statisticReports: SearchResponse<StatisticReport[]>;
  statisticParameters: StatisticParameters;
  filtersForm: FormGroup;
  displayedColumns = ['title', 'fileFormat', 'date', 'createDate', 'actions'];
  currentPage: PaginationElement = PaginationConstants.firstPage;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
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
    this.store.dispatch([new SetReportsPerPage(itemsPerPage), new GetStatisticReports(this.statisticParameters)]);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeReports(page), new GetStatisticReports(this.statisticParameters)]);
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
    this.statisticParameters = {
      ReportDataType: this.filtersForm.get('format').value,
      ReportType: this.filtersForm.get('period').value
    };
  }
}
