/**
 * RegExp Constants
 */

export const TEXT_REGEX: RegExp = /^[А-Яа-яЇїІіЄєЁё'’\s-]*$/;
export const TEXT_WITH_DIGITS_REGEX: RegExp = /^[А-Яа-яЇїІіЄєЁё'’.,\s\d\/-]*$/;
export const DATE_REGEX: RegExp = /[^0-9./-]*/g;
export const NAME_REGEX: RegExp = /^[А-Яа-яЇїІіЄєЁё'’-]*$/;
export const BIRTH_CERTIFICATE_REGEX: RegExp = /^[A-Za-zА-Яа-яЇїІіЄєЁё'’\s\d-№]*$/;
