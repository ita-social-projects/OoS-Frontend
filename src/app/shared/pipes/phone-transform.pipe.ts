import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../constants/constants';

@Pipe({
  name: 'phoneTransform'
})
export class PhoneTransformPipe implements PipeTransform {
  transform(phone: string): string {
    if (phone.length === 9) {
      phone = Constants.PHONE_PREFIX + phone;
    }

    if (phone.length === 13) {
      return phone.replace(/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2)$3-$4-$5');
    }

    return phone;
  }
}
