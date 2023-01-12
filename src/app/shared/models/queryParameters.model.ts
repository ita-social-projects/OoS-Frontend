import { StatisticFileFormat, StatisticPeriodTitle } from '../enum/statistics';

export interface PaginationParameters {
  from?: number;
  size?: number;
}

export interface StatisticParameters extends PaginationParameters {
  ReportType: StatisticPeriodTitle;
  ReportDataType: StatisticFileFormat;
}
