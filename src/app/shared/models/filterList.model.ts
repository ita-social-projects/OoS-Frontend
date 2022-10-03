import { Direction } from "./category.model";

export interface FilterList{
  withDisabilityOption: boolean;
  categoryCheckBox: Direction[];
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