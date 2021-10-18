export interface WorkingDaysToggleValue {
  value: string;
  selected: boolean;
}
export class DateTimeRanges {
  id?: number;
  workdays: string[];
  startTime: string;
  endTime: string;

  constructor(workHour) {
    this.workdays = workHour.workdays;
    this.startTime = workHour.startTime;
    this.endTime = workHour.endTime;
    if (workHour.id) {
      this.id = workHour.id;
    }
  }
}