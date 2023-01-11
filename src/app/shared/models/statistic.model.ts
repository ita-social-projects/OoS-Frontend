import { StatisticFileFormat, StatisticPeriod } from '../enum/statistics';

export interface StatisticReport {
  id: string;
  date: Date;
  reportType: StatisticPeriod;
  reportDataType: StatisticFileFormat;
  title: string;
  externalStorageId: string;
}
