export class ValidationConstants {
  //Age
  static readonly AGE_MIN = 0;
  static readonly AGE_MAX = 18;
  static readonly BIRTH_AGE_MAX = 120;
  static readonly MAX_AGE_LENGTH = 2;

  //Price
  static readonly MIN_PRICE = 1;
  static readonly MAX_PRICE = 10000;
  static readonly MAX_PRICE_LENGTH = 4;

  //Description length
  static readonly MAX_DESCRIPTION_LENGTH_500 = 500;
  static readonly MAX_DESCRIPTION_LENGTH_300 = 300;
  static readonly MAX_DESCRIPTION_LENGTH_1000 = 2000;

  //Input Length
  static readonly MAX_INPUT_LENGTH_256 = 256;
  static readonly MAX_INPUT_LENGTH_60 = 60;
  static readonly MAX_INPUT_LENGTH_30 = 30;
  static readonly MAX_INPUT_LENGTH_20 = 20;
  static readonly MAX_INPUT_LENGTH_15 = 15;

  static readonly MIN_INPUT_LENGTH_10 = 10;
  static readonly MIN_INPUT_LENGTH_3 = 3;
  static readonly MIN_INPUT_LENGTH_1 = 1;

  static readonly MAX_KEYWORDS_LENGTH = 5;
  static readonly PHONE_LENGTH = 9;

  //Entity Amount
  static readonly CHILDREN_AMOUNT_MAX = 20;

  //Time
  static readonly MIN_TIME = '00:00';
  static readonly MAX_TIME = '23:59';

  //Search
  static readonly MAX_SEARCH_LENGTH_200 = 200;
}