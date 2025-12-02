export interface WorkingDaysToggleValue {
  value: string;
  selected: boolean;
}
export class DateTimeRanges {
  id?: number;
  workdays: string[];
  startTime: string;
  endTime: string;
}
