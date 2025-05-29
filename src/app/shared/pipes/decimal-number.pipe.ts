import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimal'
})
export class DecimalNumberPipe implements PipeTransform {
  public transform(value: string, digits: number = 2): string {
    if (value || value.trim() !== '') {
      const parsed = Number.parseFloat(value);
      return !isNaN(parsed) ? parsed.toFixed(digits) : value;
    }

    return value;
  }
}
