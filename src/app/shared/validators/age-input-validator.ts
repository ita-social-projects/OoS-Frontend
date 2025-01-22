import { ValidationConstants } from 'shared/constants/validation';

export function validateAgeInput(value: number): number {
  const stringValue: string = value?.toString();
  return stringValue?.length > ValidationConstants.MAX_AGE_LENGTH ? parseInt(stringValue.slice(0, 3)) : value;
}
