/**
 * RegExp Constants
 */

//Regex for lastName, firstName, middleName, fullName
export const NAME_REGEX: RegExp = /^[А-Яа-яЇїІіЄєЁёҐґ'’-]*$/;
//Regex for non-latin characters
export const NO_LATIN_REGEX: RegExp = /[^A-Za-z]*$/;
//Regex for date
export const DATE_REGEX: RegExp = /[^0-9./-]*/g;
