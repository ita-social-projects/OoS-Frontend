import { TIME_REGEX_REPLACE } from 'shared/constants/regex-constants';

export function validateTimeInput(value: string): string {
  value = value?.replace(TIME_REGEX_REPLACE, '');
  if (value?.length > 2 && !value?.includes(':')) {
    value = value?.slice(0, 2) + ':' + value?.slice(2);
  }
  return value;
}
