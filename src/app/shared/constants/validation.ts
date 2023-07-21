import { ValidatorFn, Validators } from '@angular/forms';

import { HOUSE_REGEX, NO_LATIN_REGEX, SECTION_NAME_REGEX, STREET_REGEX } from './regex-constants';

export class ValidationConstants {
  // Age
  static readonly AGE_MIN = 0;
  static readonly AGE_MAX = 18;
  static readonly BIRTH_AGE_MAX = 120;
  static readonly MAX_AGE_LENGTH = 2;

  // Price
  static readonly MIN_PRICE = 1;
  static readonly MAX_PRICE = 100000;
  static readonly MAX_PRICE_LENGTH = 4;

  // Description length
  static readonly MIN_DESCRIPTION_LENGTH_1 = 1;
  static readonly MAX_DESCRIPTION_LENGTH_500 = 500;
  static readonly MAX_DESCRIPTION_LENGTH_300 = 300;
  static readonly MAX_DESCRIPTION_LENGTH_2000 = 2000;

  // Input Length
  static readonly INPUT_LENGTH_256 = 256;
  static readonly INPUT_LENGTH_100 = 100;
  static readonly INPUT_LENGTH_60 = 60;
  static readonly INPUT_LENGTH_30 = 30;
  static readonly INPUT_LENGTH_15 = 15;
  static readonly INPUT_LENGTH_10 = 10;
  static readonly INPUT_LENGTH_8 = 8;
  static readonly INPUT_LENGTH_3 = 3;
  static readonly INPUT_LENGTH_1 = 1;

  static readonly MAX_KEYWORDS_LENGTH = 5;
  static readonly PHONE_LENGTH = 9;

  // Entity Amount
  static readonly CHILDREN_AMOUNT_MAX = 20;

  // Time
  static readonly MIN_TIME = '00:00';
  static readonly MAX_TIME = '23:59';

  // Search
  static readonly MAX_SEARCH_LENGTH_200 = 200;
}

export class FormValidators {
  static readonly defaultStreetValidators: ValidatorFn[] = [
    Validators.required,
    Validators.pattern(STREET_REGEX),
    Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
    Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
  ];

  static readonly defaultHouseValidators: ValidatorFn[] = [
    Validators.required,
    Validators.pattern(HOUSE_REGEX),
    Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
    Validators.maxLength(ValidationConstants.INPUT_LENGTH_15)
  ];

  static readonly defaultSearchValidators: ValidatorFn[] = [
    Validators.required,
    Validators.pattern(NO_LATIN_REGEX),
    Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
    Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
  ];

  static readonly defaultSectionNameValidators: ValidatorFn[] = [
    Validators.required,
    Validators.pattern(SECTION_NAME_REGEX),
    Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
    Validators.maxLength(ValidationConstants.INPUT_LENGTH_100)
  ];
}
