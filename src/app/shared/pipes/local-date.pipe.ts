import { Pipe, PipeTransform } from '@angular/core';
import moment, { Moment } from 'moment';

@Pipe({
  name: 'localDate'
})
export class LocalDatePipe implements PipeTransform {
  public transform(date: string, format?: string): string {
    return moment
      .utc(date)
      .local()
      .format(format || 'DD.MM.YY HH:mm');
  }
}
