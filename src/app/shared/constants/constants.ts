import { MatDateFormats } from '@angular/material/core';
import { WorkingDays } from '../enum/enumUA/working-hours';
import { City } from '../models/city.model';
import { WorkingDaysToggleValue } from '../models/workingHours.model';

/**
 * Constants for OutOfSchool
 */
export class Constants {
  static readonly CHILDREN_AMOUNT_MAX = 20;
  static readonly PHONE_PREFIX = '+380';
  static readonly PROVIDER_ENTITY_TYPE = 1;
  static readonly WORKSHOP_ENTITY_TYPE = 2;

  static readonly RATE_ONE_STAR = 1;
  static readonly RATE_TWO_STAR = 2;
  static readonly RATE_THREE_STAR = 3;
  static readonly RATE_FOUR_STAR = 4;
  static readonly RATE_FIVE_STAR = 5;

  static readonly FULL_DATE_FORMAT = 'dd MMMM yyyy, hh:mm';
  static readonly SHORT_DATE_FORMAT = 'dd.MM.yyyy';
  static readonly DATE_FORMAT_PLACEHOLDER = 'ДД/ММ/РРРР';
  static readonly MAIL_FORMAT_PLACEHOLDER = 'example@mail.com';

  static readonly SCROLL_TO_TOP_BUTTON_POS = 300;
  static readonly SOCIAL_GROUP_ID_ABSENT_VALUE = 0;
  static readonly INSTITUTION_STATUS_ID_ABSENT_VALUE = 0;

  static readonly UNABLE_CREATE_PROVIDER = 'Unable to create a new provider';
  static readonly THERE_IS_SUCH_DATA = ': There is already a provider with such a data';

  static readonly NO_CITY = 'Такого міста немає';
  static readonly KIEV: City = {
    district: 'м.Київ',
    id: 14446,
    longitude: 30.5595,
    latitude: 50.44029,
    name: 'Київ',
    region: 'м.Київ',
  };

  static readonly MAT_TOOL_TIP_POSITION_BELOW = 'below';
  static readonly NO_INFORMATION = `не вказано`;
  static readonly MODAL_SMALL = '500px';
  static readonly MODAL_MEDIUM = '1024px';
}
export class PaginationConstants {
  static readonly FIRST_PAGINATION_PAGE = 1;
  static readonly MAX_PAGE_PAGINATOR_DISPLAY = 7;
  static readonly PAGINATION_DOTS = '...';
  static readonly PAGINATION_SHIFT_DELTA = 3;
  static readonly ITEMS_PER_PAGE_TEN = 10;
  static readonly ITEMS_PER_PAGE_DEFAULT = 2 * Math.floor(window.innerWidth / (332))
};

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

export const AchievementsTitle = [
  { id: 1, name: "Переможці міжнародних та всеукраїнських спортивних змагань (індивідуальних та командних)" },
  { id: 2, name: "Призери та учасники міжнародних, всеукраїнських та призери регіональних конкурсів і виставок наукових, технічних, дослідницьких, інноваційних, ІТ проектів" },
  { id: 3, name: "Реципієнти міжнародних грантів" },
  { id: 4, name: "Призери міжнародних культурних конкурсів та фестивалів" },
  { id: 5, name: "Соціально активні категорії учнів" },
  { id: 6, name: "Цифрові інструменти Google для закладів вищої та фахової передвищої освіти" },
  { id: 7, name: "Переможці та учасники олімпіад міжнародного та всеукраїнського рівнів" }
];

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

export class CropperConfigurationConstants {
  static readonly defaultCropperAspectRatio = 1/1;
  static readonly coverImageCropperAspectRatio = 5/3;
  static readonly galleryImagesCropperAspectRatio = 7/4;
  static readonly cropperMinWidth = 512;
  static readonly cropperMaxWidth = 10000;
  static readonly cropperMinHeight = 250;
  static readonly cropperMaxHeight = 8000;
  static readonly croppedFormat = ['png', 'jpeg'];
}