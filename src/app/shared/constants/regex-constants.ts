/**
 * RegExp Constants
 */

export const TEXT_REGEX: RegExp = /^\S[А-Яа-яЇїІіЄєЁёҐґ'’\s-]*$/;
export const TEXT_WITH_DIGITS_REGEX: RegExp = /^[А-Яа-яЇїІіЄєЁёҐґ'’.,\s\d\/-]*$/;
export const DATE_REGEX: RegExp = /[^0-9./-]*/g;
export const NAME_REGEX: RegExp = /^[А-Яа-яЇїІіЄєЁёҐґ'’-]*$/;
export const BIRTH_CERTIFICATE_REGEX: RegExp = /^[A-Za-zА-Яа-яЇїІіЄєЁёҐґ'’\s\d-№]*$/;
export const EDRPOUIPN_REGEX: RegExp = /^[A-Za-zА-Яа-яЇїІіЄєЁёҐґ'’`.,\s\d-№]*$/;
export const WEB_INST_FB_REGEX: RegExp = /^[A-Za-zА-Яа-яЇїІіЄєЁёҐґ'’.,!@\d\/-]*$/;
export const FOUNDER_REGEX: RegExp = /^\S[А-Яа-яЇїІіЄєЁёҐґ'’\s/-]*$/;
