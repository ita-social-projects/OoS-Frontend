import { WorkshopOpenStatus } from '../enum/workshop';
import { Direction } from './category.model';
import { Codeficator } from './codeficator.model';
import { SearchResponse } from './search.model';
import { WorkshopCard } from './workshop.model';

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
  settlement: Codeficator;
  searchQuery: string;
  order: string;
  filteredWorkshops: SearchResponse<WorkshopCard[]>;
  withDisabilityOption: boolean;
  isStrictWorkdays: boolean;
  isAppropriateHours: boolean;
  isLoading: boolean;
  isConfirmCity: boolean;
  statuses: WorkshopOpenStatus[];
}
