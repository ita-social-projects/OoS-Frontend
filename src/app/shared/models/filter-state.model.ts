import { Direction } from './category.model';
import { Codeficator } from './codeficator.model';
import { WorkshopFilterCard } from './workshop.model';

export interface FilterStateModel {
  directions: Direction[];
  maxAge: number;
  minAge: number;
  isAppropriateAge: boolean;
  workingDays: string[];
  startTime: string;
  endTime: string;
  isFree: boolean;
  isPaid: boolean;
  maxPrice: number;
  minPrice: number;
  isOpenRecruitment: boolean;
  isClosedRecruitment: boolean;
  settlement: Codeficator;
  searchQuery: string;
  order: string;
  filteredWorkshops: WorkshopFilterCard;
  withDisabilityOption: boolean;
  isStrictWorkdays: boolean;
  isAppropriateHours: boolean;
  isLoading: boolean;
  isConfirmCity: boolean;
}
