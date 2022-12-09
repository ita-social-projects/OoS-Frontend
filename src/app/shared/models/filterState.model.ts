import { WorkshopOpenStatus } from '../enum/workshop';
import { Direction } from './category.model';
import { Codeficator } from './codeficator.model';
import { SearchResponse } from './search.model';
import { WorkshopCard } from './workshop.model';
import { Coords } from './coords.model';
import { DefaultFilterFormState } from './defaultFilterFormState.model';

export interface FilterStateModel {
  filterForm: DefaultFilterFormState;
  settlement: Codeficator;
  filteredWorkshops: SearchResponse<WorkshopCard[]>;
  isLoading: boolean;
  isConfirmCity: boolean;
  mapViewCoords: Coords | null;
  userRadiusSize: number | null;
  isMapView: boolean;
}
