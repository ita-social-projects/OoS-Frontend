import { Pipe, PipeTransform } from '@angular/core';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

@Pipe({
  name: 'phoneTransform'
})
export class PhoneTransformPipe implements PipeTransform {
  transform(phone: string): string {
    return isValidPhoneNumber(phone)
      ? parsePhoneNumber(phone).formatInternational()
      : phone;
  }
}
