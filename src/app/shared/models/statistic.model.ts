import { StatisticFileFormat, StatisticPeriodType } from '../enum/statistics';

export interface StatisticReport {
  id: string;
  date: string;
  reportType: StatisticPeriodType;
  reportDataType: StatisticFileFormat;
  title: string;
  externalStorageId: string;
}
