import { Pipe, PipeTransform } from '@angular/core';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {
  public transform(phone: string): string {
    return phone && isValidPhoneNumber(phone) ? parsePhoneNumber(phone).formatInternational() : phone;
  }
}
