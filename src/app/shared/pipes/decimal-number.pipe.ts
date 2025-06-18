import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimal'
})
export class DecimalNumberPipe implements PipeTransform {
  public transform(value: string | number, digits: number = 2): string {
    const stringifiedValue = value.toString();
    if (stringifiedValue || stringifiedValue.trim() !== '') {
      const parsed = Number.parseFloat(stringifiedValue);
      return !isNaN(parsed) ? parsed.toFixed(digits) : stringifiedValue;
    }

    return stringifiedValue;
  }
}
