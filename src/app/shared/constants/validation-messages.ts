import { ValidationErrorsEnum } from 'shared/enum/validation-errors';
import {
  NAME_REGEX,
  FULL_NAME_REGEX,
  NO_LATIN_REGEX,
  STREET_REGEX,
  HOUSE_REGEX,
  SECTION_NAME_REGEX,
  MUST_CONTAIN_LETTERS
} from './regex-constants';

export interface ValidationMessageConfig {
  base?: string;
  detail?: string;
  parts?: string[];
}
export interface ValidationParams {
  minCharacters: string;
  maxCharacters: string;
  minValue: string;
  maxValue: string;
  currentCharactersCount: string;
}
export class ValidationMessages {
  // For message's base
  public readonly REQUIRED_INPUT = 'FORMS.VALIDATIONS.REQUIRED_INPUT';
  public readonly INVALID_EMAIL = 'FORMS.VALIDATIONS.INVALID_EMAIL';
  public readonly INVALID_BIRTHDAY = 'FORMS.VALIDATIONS.INVALID_BIRTHDAY';
  public readonly INVALID_TIME_RANGE = 'FORMS.VALIDATIONS.INVALID_TIME_RANGE';
  public readonly INVALID_TIME_FORMAT = 'FORMS.VALIDATIONS.INVALID_TIME_FORMAT';
  public readonly INVALID_AGE_RANGE = 'FORMS.VALIDATIONS.INVALID_AGE_RANGE';
  public readonly INVALID_EMAIL_TYPE = 'FORMS.VALIDATIONS.INVALID_EMAIL_TYPE';
  public readonly LESS_THAN_PARTICIPANTS = 'FORMS.VALIDATIONS.LESS_THAN_PARTICIPANTS';
  public readonly INVALID_SEARCH = 'FORMS.VALIDATIONS.INVALID_SEARCH';
  public readonly INVALID_INPUT_BASE = 'FORMS.VALIDATIONS.INVALID_INPUT';
  public readonly INVALID_VALUE_START = 'FORMS.VALIDATIONS.INVALID_VALUE_START';
  public readonly MUST_CONTAIN_LETTERS = 'FORMS.VALIDATIONS.MUST_CONTAIN_LETTERS';
  public readonly INVALID_PHONE_NUMBER = 'FORMS.VALIDATIONS.INVALID_PHONE_NUMBER';
  public readonly INVALID_LENGTH_START_MIN = 'FORMS.VALIDATIONS.INVALID_LENGTH_START_MIN';
  public readonly INVALID_LENGTH_START = 'FORMS.VALIDATIONS.INVALID_LENGTH_START';

  // For message's details and parts
  // Parts would be displayed in lowercase
  public readonly INVALID_CHARACTERS = 'FORMS.VALIDATIONS.INVALID_CHARACTERS';
  public readonly INVALID_SYMBOLS = 'FORMS.VALIDATIONS.INVALID_SYMBOLS';
  public readonly INVALID_LENGTH_END = 'FORMS.VALIDATIONS.INVALID_LENGTH_END';
  public readonly CURRENT_COUNT = 'FORMS.VALIDATIONS.CURRENT_COUNT';
  public readonly INVALID_DATA_START = 'FORMS.VALIDATIONS.INVALID_DATA_START';
  public readonly SHORT_DATE_FORMAT = 'FORMS.PLACEHOLDERS.SHORT_DATE_FORMAT';
  public readonly INVALID_DATA_END = 'FORMS.VALIDATIONS.INVALID_DATA_END';
  public readonly INVALID_EDRPO_IPN_END = 'FORMS.VALIDATIONS.INVALID_EDRPO_IPN_END';
  public readonly INVALID_STREET = 'FORMS.VALIDATIONS.INVALID_STREET';
  public readonly INVALID_HOUSE = 'FORMS.VALIDATIONS.INVALID_HOUSE';
  public readonly INVALID_SECTION_NAME = 'FORMS.VALIDATIONS.INVALID_SECTION_NAME';
  public readonly NO_MORE_THAN = 'NO_MORE_THAN';

  // Validation's "From" and "To" must have parameters
  public readonly FROM = 'FORMS.VALIDATIONS.FROM';
  public readonly TO = 'FORMS.VALIDATIONS.TO';

  public readonly messageConfigs: { [errorKey: string]: ValidationMessageConfig } = {
    required: {
      base: this.REQUIRED_INPUT
    },
    incorrectDateField: {
      base: this.INVALID_INPUT_BASE,
      parts: [this.INVALID_DATA_START, this.SHORT_DATE_FORMAT, this.INVALID_DATA_END]
    },
    invalidCharacters: {
      base: this.INVALID_INPUT_BASE,
      detail: this.INVALID_CHARACTERS
    },
    invalidSymbols: {
      base: this.INVALID_INPUT_BASE,
      detail: this.INVALID_SYMBOLS
    },
    invalidFieldLength: {
      base: this.INVALID_LENGTH_START
    },
    invalidPhoneLength: {
      base: this.INVALID_LENGTH_START_MIN,
      detail: this.INVALID_LENGTH_END
    },
    invalidPhoneNumber: {
      base: this.INVALID_PHONE_NUMBER
    },
    invalidDateRange: {
      base: this.INVALID_INPUT_BASE,
      detail: this.INVALID_BIRTHDAY
    },
    invalidEmail: {
      base: this.INVALID_EMAIL
    },
    invalidEdrpouIpn: {
      base: this.INVALID_LENGTH_START,
      detail: this.INVALID_EDRPO_IPN_END
    },
    invalidStreet: {
      base: this.INVALID_INPUT_BASE,
      detail: this.INVALID_STREET
    },
    invalidHouse: {
      base: this.INVALID_INPUT_BASE,
      detail: this.INVALID_HOUSE
    },
    invalidSearch: {
      base: this.INVALID_SEARCH
    },
    invalidTimeFormat: {
      base: this.INVALID_TIME_FORMAT
    },
    invalidTimeRange: {
      base: this.INVALID_TIME_RANGE
    },
    invalidAgeRange: {
      base: this.INVALID_AGE_RANGE
    },
    invalidValue: {
      base: this.INVALID_VALUE_START,
      parts: [this.FROM, this.TO]
    },
    invalidSectionName: {
      base: this.INVALID_INPUT_BASE,
      detail: this.INVALID_SECTION_NAME
    },
    mustContainLetters: {
      base: this.MUST_CONTAIN_LETTERS
    },
    minNumberValue: {
      base: this.LESS_THAN_PARTICIPANTS
    },
    invalidEmailType: {
      base: this.INVALID_EMAIL_TYPE
    }
  };
}

export const PatternMapper: { pattern: RegExp; errorKey: string }[] = [
  { pattern: NAME_REGEX, errorKey: ValidationErrorsEnum.InvalidSymbols },
  { pattern: FULL_NAME_REGEX, errorKey: ValidationErrorsEnum.InvalidSymbols },
  { pattern: NO_LATIN_REGEX, errorKey: ValidationErrorsEnum.InvalidCharacters },
  { pattern: STREET_REGEX, errorKey: ValidationErrorsEnum.InvalidStreet },
  { pattern: HOUSE_REGEX, errorKey: ValidationErrorsEnum.InvalidHouse },
  { pattern: SECTION_NAME_REGEX, errorKey: ValidationErrorsEnum.InvalidSectionName },
  { pattern: MUST_CONTAIN_LETTERS, errorKey: ValidationErrorsEnum.MustContainLetters }
];
