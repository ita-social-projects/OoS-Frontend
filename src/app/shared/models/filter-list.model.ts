import { FormOfLearning, WorkshopOpenStatus, PayRateType } from 'shared/enum/workshop';

export interface FilterList {
  withDisabilityOption: boolean;
  statuses: WorkshopOpenStatus[];
  formsOfLearning: FormOfLearning[];
  directionIds: number[];
  subdirectionIds: number[];
  indeterminateDirectionIds: number[];
  ageFilter: AgeFilter;
  priceFilter: PriceFilter;
  workingHours: WorkingHoursFilter;
  order: string;
  languageOfEducationId: number;
}

export interface AgeFilter {
  minAge: number;
  maxAge: number;
  noAgeRestriction: boolean;
  isAppropriateAge: boolean;
}

export interface PriceFilter {
  minPrice: number;
  maxPrice: number;
  isFree: boolean;
  isPaid: boolean;
  payRate: PayRateType;
  limitMinMaxPrice: MinMaxPriceFilter;
}

export interface MinMaxPriceFilter {
  minPrice: number;
  maxPrice: number;
  isActiveLimitation: boolean;
}

export interface WorkingHoursFilter {
  workingDays: string[];
  startTime: string;
  endTime: string;
  isStrictWorkdays: boolean;
  isAppropriateHours: boolean;
}
