import { StatisticFileFormat, StatisticPeriodType } from '../enum/statistics';
import { PaginationParameters } from './queryParameters.model';

export interface StatisticReport {
  id: string;
  date: string;
  reportType: StatisticPeriodType;
  reportDataType: StatisticFileFormat;
  title: string;
  externalStorageId: string;
}

export interface StatisticParameters extends PaginationParameters {
  ReportType: StatisticPeriodType;
  ReportDataType: StatisticFileFormat;
}
