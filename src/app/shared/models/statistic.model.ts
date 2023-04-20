import { StatisticFileFormats, StatisticPeriodTypes } from '../enum/statistics';
import { PaginationParameters } from './queryParameters.model';

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
