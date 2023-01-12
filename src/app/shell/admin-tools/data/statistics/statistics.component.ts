import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { SearchResponse } from '../../../../shared/models/search.model';
import { StatisticReport } from '../../../../shared/models/statistic.model';
import { AdminState } from '../../../../shared/store/admin.state';
import { GetStatisticReports } from '../../../../shared/store/admin.actions';
import { StatisticPeriodType, StatisticPeriodTitle, StatisticFileFormat } from '../../../../shared/enum/statistics';
import { StatisticParameters } from '../../../../shared/models/queryParameters.model';

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

  statisticParameters: StatisticParameters;
  filtersForm: FormGroup;
  displayedColumns = ['title', 'fileFormat', 'date', 'createDate', 'actions'];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      period: new FormControl(StatisticPeriodType.WorkshopsDaily),
      format: new FormControl(StatisticFileFormat.CSV)
    });

    this.setParams();
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
