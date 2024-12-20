import { MatDateFormats } from '@angular/material/core';
import { MatTooltipDefaultOptions } from '@angular/material/tooltip';

import { CodeficatorCategories } from 'shared/enum/codeficator-categories';
import { WorkingDays } from 'shared/enum/enumUA/working-hours';
import { Codeficator } from 'shared/models/codeficator.model';
import { WorkingDaysToggleValue } from 'shared/models/working-hours.model';
import { ImageFormat } from 'shared/enum/image-format';

/**
 * Constants for OutOfSchool
 */
export class Constants {
  static readonly CHILDREN_AMOUNT_MAX = 20;
  static readonly PROVIDER_ENTITY_TYPE = 1;
  static readonly WORKSHOP_ENTITY_TYPE = 2;
  static readonly WORKSHOP_MIN_SEATS = 1;
  static readonly WORKSHOP_UNLIMITED_SEATS = 4294967295;

  static readonly RATE_ONE_STAR = 1;
  static readonly RATE_TWO_STAR = 2;
  static readonly RATE_THREE_STAR = 3;
  static readonly RATE_FOUR_STAR = 4;
  static readonly RATE_FIVE_STAR = 5;

  static readonly FULL_DATE_FORMAT = 'dd MMMM yyyy, HH:mm';
  static readonly FULL_DATE_FORMAT_ONLY_DIGITS = 'dd.MM.yyyy, HH:mm';
  static readonly SHORT_DATE_FORMAT = 'dd.MM.yyyy';
  static readonly SHORT_TIME_24_HOUR_SYSTEM = 'HH:mm';

  static readonly MAIL_FORMAT_PLACEHOLDER = 'example@mail.com';
  static readonly DASH_VALUE = 'dash';
  static readonly DASH = '—';

  static readonly SCROLL_TO_TOP_BUTTON_POS = 300;
  static readonly INSTITUTION_ID_ABSENT_VALUE = 0;

  static readonly UNABLE_CREATE_PROVIDER = 'Unable to create a new provider';
  static readonly THERE_IS_SUCH_DATA = ': There is already a provider with such a data';

  static readonly NO_SETTLEMENT = 'EMPTY_BANNERS.NO_SETTLEMENT';
  static readonly NO_TERRITORIAL_COMMUNITY = 'EMPTY_BANNERS.NO_TERRITORIAL_COMMUNITY';
  static readonly KYIV: Codeficator = {
    id: 31737,
    region: null,
    category: CodeficatorCategories.SpecialStatusCity,
    territorialCommunity: null,
    settlement: 'Київ',
    cityDistrict: null,
    latitude: 50.44029,
    longitude: 30.5595,
    fullName: 'Київ'
  };

  static readonly MAT_TOOL_TIP_POSITION_ABOVE = 'above';
  static readonly MAT_TOOL_TIP_POSITION_BELOW = 'below';
  static readonly NO_INFORMATION = 'SERVICE_MESSAGES.NO_INFO';
  static readonly MODAL_SMALL = '500px';
  static readonly MODAL_MEDIUM = '1024px';

  static readonly MAX_PREVIOUS_SEARCH_RESULTS = 10;
}

export class PaginationConstants {
  static readonly FIRST_PAGINATION_PAGE = 1;
  static readonly MAX_PAGE_PAGINATOR_DISPLAY = 7;
  static readonly PAGINATION_DOTS = '...';
  static readonly PAGINATION_SHIFT_DELTA = 3;
  static readonly ITEMS_PER_PAGE_TEN = 10;
  static readonly ITEMS_PER_PAGE_DEFAULT = 2 * Math.floor(window.innerWidth / 332);
  static readonly firstPage = {
    element: 1,
    isActive: true
  };
  static readonly ACHIEVEMENTS_PER_PAGE = 12;
  static readonly WORKSHOPS_PER_PAGE = 12;
  static readonly DIRECTIONS_PER_PAGE = 12;
  static readonly APPLICATIONS_PER_PAGE = 8;
  static readonly CHILDREN_PER_PAGE = 8;
  static readonly CHATROOMS_PER_PAGE = 8;
  static readonly RATINGS_PER_PAGE = 12;
  static readonly TABLE_ITEMS_PER_PAGE = 12;
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
    selected: false
  },
  {
    value: WorkingDays.tuesday,
    selected: false
  },
  {
    value: WorkingDays.wednesday,
    selected: false
  },
  {
    value: WorkingDays.thursday,
    selected: false
  },
  {
    value: WorkingDays.friday,
    selected: false
  },
  {
    value: WorkingDays.saturday,
    selected: false
  },
  {
    value: WorkingDays.sunday,
    selected: false
  }
];

export class CropperConfigurationConstants {
  static readonly defaultCropperAspectRatio = 1 / 1;
  static readonly coverImageCropperAspectRatio = 5 / 3;
  static readonly galleryImagesCropperAspectRatio = 7 / 4;
  static readonly cropperMinWidth = 512;
  static readonly cropperMaxWidth = 10000;
  static readonly cropperMinHeight = 250;
  static readonly cropperMaxHeight = 8000;
  static readonly croppedFormat = [ImageFormat.PNG, ImageFormat.JPEG];
  static readonly croppedQuality = 90;
  static readonly croppedGalleryImage = {
    height: 300
  };
  static readonly croppedCoverImage = {
    height: 250
  };
}

export class ModeConstants {
  static readonly NEW = 'new';
  static readonly WORKSHOP = 'workshop';
  static readonly APPLICATION = 'application';
  static readonly SHORT = 'short';
  static readonly FULL = 'full';
}

export const EMPTY_RESULT = { totalAmount: 0, entities: [] };

export const NoInteractTooltipOptions: MatTooltipDefaultOptions = {
  showDelay: 0,
  hideDelay: 0,
  touchGestures: 'auto',
  position: 'before',
  touchendHideDelay: 0,
  disableTooltipInteractivity: true
};
