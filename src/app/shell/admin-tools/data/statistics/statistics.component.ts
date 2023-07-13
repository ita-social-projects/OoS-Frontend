import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { SearchResponse } from 'shared/models/search.model';
import { StatisticParameters, StatisticReport } from 'shared/models/statistic.model';
import { AdminState } from 'shared/store/admin.state';
import { DownloadStatisticReport, GetStatisticReports } from 'shared/store/admin.actions';
import { StatisticFileFormats, StatisticPeriodTypes } from 'shared/enum/statistics';
import { PaginationConstants } from 'shared/constants/constants';
import { PaginationElement } from 'shared/models/paginationElement.model';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { Util } from 'shared/utils/utils';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { StatisticPeriodTitles } from 'shared/enum/enumUA/statistics';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  readonly StatisticPeriodTitles = StatisticPeriodTitles;
  readonly StatisticFileFormats = StatisticFileFormats;
  readonly noReports = NoResultsTitle.noResult;

  @Select(AdminState.statisticsReports)
  statisticReports$: Observable<SearchResponse<StatisticReport[]>>;
  @Select(AdminState.downloadedReport)
  uploadedReport$: Observable<HttpResponse<Blob>>;

  statisticReports: SearchResponse<StatisticReport[]>;
  statisticParameters: StatisticParameters = {
    ReportDataType: null,
    ReportType: null,
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE,
    from: 0
  };
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
      period: new FormControl(StatisticPeriodTypes.WorkshopsDaily),
      format: new FormControl(StatisticFileFormats.CSV)
    });

    this.uploadedReport$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((response: HttpResponse<Blob>) => {
      const downloadLink = document.createElement('a');
      downloadLink.download = new Date(Date.now()).toDateString();
      downloadLink.href = window.URL.createObjectURL(response.body);
      downloadLink.click();
    });

    this.setParams();
    this.addNavPath();
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

  onLoadReport(id: string): void {
    this.store.dispatch(new DownloadStatisticReport(id));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  private setParams(): void {
    this.statisticParameters.ReportDataType = this.filtersForm.get('format').value;
    this.statisticParameters.ReportType = this.filtersForm.get('period').value;
  }

  private getReports(): void {
    Util.setFromPaginationParam(this.statisticParameters, this.currentPage, this.statisticReports?.totalAmount);
    this.store.dispatch(new GetStatisticReports(this.statisticParameters));
  }

  private addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Statistics,
        isActive: false,
        disable: true
      })
    );
  }
}
