export interface WorkingHours {
  value: string;
  selected: boolean;
}
export interface SelectedWorkingHours {
  day: string[];
  timeFrom: string;
  timeTo: string;
}