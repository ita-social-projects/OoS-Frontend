import { StatisticFileFormat, StatisticPeriod } from '../enum/statistics';

export interface PaginationParameters {
  from?: number;
  size?: number;
}

export interface StatisticParameters extends PaginationParameters {
  ReportType: StatisticPeriod;
  ReportDataType: StatisticFileFormat;
}
