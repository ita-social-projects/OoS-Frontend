import { FormOfLearning, WorkshopOpenStatus } from 'shared/enum/workshop';
import { Codeficator } from './codeficator.model';
import { Coords } from './coords.model';
import { SearchResponse } from './search.model';
import { WorkshopCard } from './workshop.model';

export interface FilterStateModel {
  directionIds: number[];
  maxAge: number;
  minAge: number;
  isAppropriateAge: boolean;
  workingDays: string[];
  startTime: string;
  endTime: string;
  formsOfLearning: FormOfLearning[];
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
  mapViewCoords: Coords | null;
  userRadiusSize: number | null;
  isMapView: boolean;
  from: number;
  size: number;
  previousResults: string[];
}
