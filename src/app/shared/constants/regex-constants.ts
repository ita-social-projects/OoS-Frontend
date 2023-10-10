/**
 * RegExp Constants
 */

// Regex for text
export const TEXT_REGEX: RegExp = /^\S[А-Яа-яЇїІіЄєЁёҐґ'’`\s-]*$/;

// Regex for lastName, firstName, middleName, fullName
export const NAME_REGEX: RegExp = /^[А-Яа-яЇїІіЄєЁёҐґ'’`-]*[А-Яа-яЇїІіЄєЁёҐґ]$/;

// Regex for email
export const EMAIL_REGEX: RegExp = /^[\w.-]+@([\w.-]+\.)+[\w.-]{2,6}$/;

// Regex for EDRPOU and IPN
export const EDRPOU_IPN_REGEX: RegExp = /^(\d{8}|\d{10})$/;

// Regex for non-latin characters
export const NO_LATIN_REGEX: RegExp = /^[А-ЩЬЮЯҐЄІЇа-щьюяґєії0-9.,_ \-’!@#$%^/&*()+={}\\|<>~`':;"]+$/;

// Regex for date
export const DATE_REGEX: RegExp = /[^0-9./-]*/g;

// Regex for street name
export const STREET_REGEX: RegExp = /^[А-Яа-яЇїІіЄєЁёҐґ'’`.\s-]*(?:\s*\([^()]+\))?\s*$/;

// Regex for house number
export const HOUSE_REGEX: RegExp = /^(?!.*\d[\/\-]$)\d+(?:[А-Яа-яЇїІіЄєЁёҐґ]*)?(?:[\/\-][\dА-Яа-яЇїІіЄєЁёҐґ]+(?:[А-Яа-яЇїІіЄєЁёҐґ]+)*)?(?:\s+[А-Яа-яЇїІіЄєЁёҐґ]*\.\s*[0-9А-Яа-яЇїІіЄєЁёҐґ]+\s*)?$/;

// Regex for section name, it checks that the first char is a letter
export const SECTION_NAME_REGEX: RegExp = /^(?!`)(?!\^)(?!_)(?!\[)(?!])(?!\\)[А-ЩЬЮЯҐЄІЇа-щьюяґєіїA-Za-z].+/;
