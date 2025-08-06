import { ValidationConstants } from 'shared/constants/validation';
import { FormOfLearning, WorkshopOpenStatus, PayRateType } from 'shared/enum/workshop';
import { MinMaxPriceFilter } from 'shared/models/filter-list.model';

/**
 * Default filter state model
 */
export class DefaultFilterState {
  directionIds: number[] = [];
  subdirectionIds: number[] = [];
  indeterminateDirectionIds: number[] = [];
  maxAge: number = null;
  minAge: number = null;
  isAppropriateAge = false;
  startTime: string = null;
  endTime: string = null;
  workingDays: string[] = [];
  formsOfLearning: FormOfLearning[] = [];
  isFree = false;
  isPaid = false;
  payRate: PayRateType = PayRateType.None;
  maxPrice = ValidationConstants.MAX_PRICE;
  minPrice = ValidationConstants.MIN_PRICE;
  limitMinMaxPrice: MinMaxPriceFilter = null;
  statuses: WorkshopOpenStatus[] = [];
  searchQuery = '';
  order = 'Rating';
  withDisabilityOption = false;
  isStrictWorkdays = false;
  isAppropriateHours = false;
  languageOfEducationId: number = null;
}
