import { FormOfLearning, WorkshopOpenStatus } from 'shared/enum/workshop';

export interface FilterList {
  withDisabilityOption: boolean;
  statuses: WorkshopOpenStatus[];
  formsOfLearning: FormOfLearning[];
  directionIds: number[];
  subDirectionIds: string[];
  ageFilter: AgeFilter;
  priceFilter: PriceFilter;
  workingHours: WorkingHoursFilter;
  order: string;
}

export interface AgeFilter {
  minAge: number;
  maxAge: number;
  isAppropriateAge: boolean;
}

export interface PriceFilter {
  minPrice: number;
  maxPrice: number;
  isFree: boolean;
  isPaid: boolean;
}

export interface WorkingHoursFilter {
  workingDays: string[];
  startTime: string;
  endTime: string;
  isStrictWorkdays: boolean;
  isAppropriateHours: boolean;
}

export interface CheckChangeEvent {
  selectedItemsIds: (string | number)[];
  changedItemId: string | number;
}
