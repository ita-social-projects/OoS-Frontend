import { MatDateFormats } from "@angular/material/core";

/**
 * Constants for OutOfSchool
 */
export class Constants {
  static readonly CLASS_AMOUNT_MIN = 1;
  static readonly CLASS_AMOUNT_MAX = 7;
  static readonly AGE_MIN = 0;
  static readonly AGE_MAX = 18;
  static readonly MIN_PRICE = 0;
  static readonly MAX_PRICE = 10000;
  static readonly MAX_DESCRIPTION_LENGTH = 500;
  static readonly MAX_TEACHER_DESCRIPTION_LENGTH = 300;
  static readonly PHONE_LENGTH = 10;
  static readonly PROVIDER_ENTITY_TYPE = 1;
  static readonly WORKSHOP_ENTITY_TYPE = 2;
  static readonly WORKSHOPS_PER_PAGE = 8;

  static readonly RATE_ONE_STAR = 1;
  static readonly RATE_TWO_STAR = 2;
  static readonly RATE_THREE_STAR = 3;
  static readonly RATE_FOUR_STAR = 4;
  static readonly RATE_FIVE_STAR = 5;

  static readonly FULL_DATE_FORMAT = 'dd MMMM yyyy, hh:mm';
  static readonly SHORT_DATE_FORMAT = 'dd MMMM yyyy';

  static readonly SCROLL_TO_TOP_BUTTON_POS = 300;

};

export class PaginationConstants {
  static readonly FIRST_PAGINATION_PAGE = 1;
  static readonly MAX_PAGE_PAGINATOR_DISPLAY = 7;
  static readonly PAGINATION_DOTS = '...';
  static readonly PAGINATION_SHIFT_DELTA = 3;
}

export const MOMENT_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'D/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM Y',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Y'
  }
};
