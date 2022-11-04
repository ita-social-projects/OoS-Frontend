import { WorkshopOpenStatus } from '../enum/workshop';

export interface FilterList{
  withDisabilityOption: boolean;
  statuses: WorkshopOpenStatus[];
  directionIds: number[];
  ageFilter: { minAge: number; maxAge: number; isAppropriateAge: boolean; };
  priceFilter: {
    minPrice: number;
    maxPrice: number;
    isFree: boolean;
    isPaid: boolean;
  };
  workingHours: {
    workingDays: string[];
    startTime: string;
    endTime: string;
    isStrictWorkdays: boolean;
    isAppropriateHours: boolean;
  };
  order: string;
}
