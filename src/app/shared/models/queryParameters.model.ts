import { StatisticFileFormat, StatisticPeriodType } from '../enum/statistics';

export interface PaginationParameters {
  from?: number;
  size?: number;
}

export interface StatisticParameters extends PaginationParameters {
  ReportType: StatisticPeriodType;
  ReportDataType: StatisticFileFormat;
}
