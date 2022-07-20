/**
 * RegExp Constants
 */
export const TEXT_REGEX: RegExp = /^\S[А-Яа-яЇїІіЄєЁёҐґ'’` \s-]*$/;
//Regex for lastName, firstName, middleName, fullName
export const NAME_REGEX: RegExp = /^[А-Яа-яЇїІіЄєЁёҐґ''’` \s-]*$/;
//Regex for non-latin characters
export const NO_LATIN_REGEX: RegExp = /^[А-ЩЬЮЯҐЄІЇа-щьюяґєії0-9.,_ \-’!@#$%^/&*()+={}\\|<>~`':;"]+$/;
//Regex for date
export const DATE_REGEX: RegExp = /[^0-9./-]*/g;
