import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, filter, takeUntil } from 'rxjs';

import { PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { StatisticPeriodTitles } from 'shared/enum/enumUA/statistics';
import { StatisticFileFormats, StatisticPeriodTypes } from 'shared/enum/statistics';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { SearchResponse } from 'shared/models/search.model';
import { StatisticParameters, StatisticReport } from 'shared/models/statistic.model';
import { DownloadStatisticReport, GetStatisticReports } from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  @Select(AdminState.statisticsReports)
  public statisticReports$: Observable<SearchResponse<StatisticReport[]>>;
  @Select(AdminState.downloadedReport)
  private uploadedReport$: Observable<HttpResponse<Blob>>;

  public readonly StatisticPeriodTitles = StatisticPeriodTitles;
  public readonly StatisticFileFormats = StatisticFileFormats;
  public readonly noReports = NoResultsTitle.noResult;

  public statisticReports: SearchResponse<StatisticReport[]>;
  public statisticParameters: StatisticParameters = {
    ReportDataType: null,
    ReportType: null,
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE,
    from: 0
  };
  public filtersForm: FormGroup;
  public displayedColumns = ['title', 'fileFormat', 'date', 'createDate', 'actions'];
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  public ngOnInit(): void {
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

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.statisticParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getReports();
  }

  public onGenerateReport(): void {
    this.setParams();
    this.store.dispatch(new GetStatisticReports(this.statisticParameters));
  }

  public onLoadReport(id: string): void {
    this.store.dispatch(new DownloadStatisticReport(id));
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
