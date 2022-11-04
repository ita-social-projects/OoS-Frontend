import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneTransform'
})
export class PhoneTransformPipe implements PipeTransform {
  transform(phone: string): string {
    return phone.length === 13 ? phone.replace(/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2)$3-$4-$5') : phone;
  }
}
