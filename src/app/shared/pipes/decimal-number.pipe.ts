import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimal'
})
export class DecimalNumberPipe implements PipeTransform {
  public transform(value: string, digits: number = 2): string {
    return Number.parseFloat(value).toFixed(digits) ?? value;
  }
}
