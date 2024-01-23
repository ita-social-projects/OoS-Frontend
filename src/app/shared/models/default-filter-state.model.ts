import { ValidationConstants } from 'shared/constants/validation';
import { WorkshopOpenStatus } from 'shared/enum/workshop';

/**
 * Default filter state model
 */
export class DefaultFilterState {
  directionIds: number[] = [];
  maxAge: number = null;
  minAge: number = null;
  isAppropriateAge = false;
  startTime: string = null;
  endTime: string = null;
  workingDays: string[] = [];
  isFree = false;
  isPaid = false;
  maxPrice = ValidationConstants.MAX_PRICE;
  minPrice = ValidationConstants.MIN_PRICE;
  statuses: WorkshopOpenStatus[] = [];
  searchQuery = '';
  order = 'Rating';
  withDisabilityOption = false;
  isStrictWorkdays = false;
  isAppropriateHours = false;
}
