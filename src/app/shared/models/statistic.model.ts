import { StatisticFileFormats, StatisticPeriodTypes } from 'shared/enum/statistics';
import { PaginationParameters } from './query-parameters.model';

export interface StatisticReport {
  id: string;
  date: string;
  reportType: StatisticPeriodTypes;
  reportDataType: StatisticFileFormats;
  title: string;
  externalStorageId: string;
}

export interface StatisticParameters extends PaginationParameters {
  ReportType: StatisticPeriodTypes;
  ReportDataType: StatisticFileFormats;
}
