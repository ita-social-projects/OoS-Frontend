import { MatDateFormats } from '@angular/material/core';
import { WorkingDays } from '../enum/enumUA/working-hours';
import { City } from '../models/city.model';
import { WorkingDaysToggleValue } from '../models/workingHours.model';

/**
 * Constants for OutOfSchool
 */
export class Constants {
  static readonly CLASS_AMOUNT_MIN = 1;
  static readonly CLASS_AMOUNT_MAX = 7;
  static readonly CHILDREN_AMOUNT_MAX = 20;
  static readonly AGE_MIN = 0;
  static readonly AGE_MAX = 18;
  static readonly BIRTH_AGE_MAX = 120;
  static readonly MIN_PRICE = 1;
  static readonly MAX_PRICE = 10000;
  static readonly MIN_TIME = '00:00';
  static readonly MAX_TIME = '23:59';
  static readonly MAX_DESCRIPTION_LENGTH = 500;
  static readonly MAX_DESCRIPTION_ABOUT_LENGTH = 2000;
  static readonly MAX_KEYWORDS_LENGTH = 5;
  static readonly MAX_TEACHER_DESCRIPTION_LENGTH = 300;
  static readonly PHONE_LENGTH = 9;
  static readonly PHONE_PREFIX = '+380';
  static readonly PROVIDER_ENTITY_TYPE = 1;
  static readonly WORKSHOP_ENTITY_TYPE = 2;

  static readonly ITEMS_PER_PAGE = 2 * Math.floor(window.innerWidth / (332));

  static readonly RATE_ONE_STAR = 1;
  static readonly RATE_TWO_STAR = 2;
  static readonly RATE_THREE_STAR = 3;
  static readonly RATE_FOUR_STAR = 4;
  static readonly RATE_FIVE_STAR = 5;

  static readonly FULL_DATE_FORMAT = 'dd MMMM yyyy, hh:mm';
  static readonly SHORT_DATE_FORMAT = 'dd.MM.yyyy';

  static readonly SCROLL_TO_TOP_BUTTON_POS = 300;

  static WorkingDaysValues: any;

  static readonly SOCIAL_GROUP_ID_ABSENT_VALUE = 0;

  static readonly KIEV: City = {
    district: 'м.Київ',
    id: 14446,
    longitude: 30.5595,
    latitude: 50.44029,
    name: 'Київ',
    region: 'м.Київ',
  };

  static readonly INSTITUTION_STATUS_ID_ABSENT_VALUE = 0;

}

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

export const WorkingDaysValues: WorkingDaysToggleValue[] = [
  {
    value: WorkingDays.monday,
    selected: false,
  },
  {
    value: WorkingDays.tuesday,
    selected: false,
  },
  {
    value: WorkingDays.wednesday,
    selected: false,
  },
  {
    value: WorkingDays.thursday,
    selected: false,
  },
  {
    value: WorkingDays.friday,
    selected: false,
  },
  {
    value: WorkingDays.saturday,
    selected: false,
  },
  {
    value: WorkingDays.sunday,
    selected: false,
  }
];

export class NotificationsConstants {
  static readonly NO_MESSAGE = 'У вас немає нових повідомлень';
}