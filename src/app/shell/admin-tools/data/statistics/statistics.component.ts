import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { SearchResponse } from '../../../../shared/models/search.model';
import { StatisticParameters, StatisticReport } from '../../../../shared/models/statistic.model';
import { AdminState } from '../../../../shared/store/admin.state';
import { GetStatisticReports } from '../../../../shared/store/admin.actions';
import { StatisticFileFormats, StatisticPeriodTypes } from '../../../../shared/enum/statistics';
import { PaginationConstants } from '../../../../shared/constants/constants';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { OnPageChangeReports, SetTableItemsPerPage } from '../../../../shared/store/paginator.actions';
import { PaginatorState } from '../../../../shared/store/paginator.state';
import { NoResultsTitle } from '../../../../shared/enum/enumUA/no-results';
import { PopNavPath, PushNavPath } from '../../../../shared/store/navigation.actions';
import { NavBarName } from '../../../../shared/enum/enumUA/navigation-bar';
import { StatisticPeriodTitles } from '../../../../shared/enum/enumUA/statistics';

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
  @Select(PaginatorState.tableItemsPerPage)
  tableItemsPerPage$: Observable<number>;

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
      period: new FormControl(StatisticPeriodTypes.WorkshopsDaily),
      format: new FormControl(StatisticFileFormats.CSV)
    });

    this.setParams();
    this.addNavPath();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetTableItemsPerPage(itemsPerPage), new GetStatisticReports(this.statisticParameters)]);
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
    this.store.dispatch(new PopNavPath());
  }

  private setParams(): void {
    this.statisticParameters = {
      ReportDataType: this.filtersForm.get('format').value,
      ReportType: this.filtersForm.get('period').value
    };
  }

  private addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Statistics,
        isActive: false,
        disable: true,
      })
    );
  }
}
