import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimal'
})
export class DecimalNumberPipe implements PipeTransform {
  public transform(value: string): string {
    return Number.parseFloat(value).toFixed(2) ?? value;
  }
}
