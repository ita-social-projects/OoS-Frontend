import { FormOfLearning, WorkshopOpenStatus } from 'shared/enum/workshop';

export interface FilterList {
  withDisabilityOption: boolean;
  statuses: WorkshopOpenStatus[];
  formsOfLearning: FormOfLearning[];
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
