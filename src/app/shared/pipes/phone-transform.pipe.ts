import { Pipe, PipeTransform } from '@angular/core';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {
  transform(phone: string): string {
    return !!phone && isValidPhoneNumber(phone)
      ? parsePhoneNumber(phone).formatInternational()
      : phone;
  }
}
