import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private readonly translate: TranslateService) {}

  public transform(value: string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const parts = value.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month - 1, day);

    const dayOfMonth = date.getDate();
    const monthIndex = date.getMonth();
    const monthNames: string[] | string = this.translate.instant('MONTHS.NAMES');
    if (!Array.isArray(monthNames) || monthIndex < 0 || monthIndex >= monthNames.length) {
      return `${dayOfMonth}/${month}/${year}`;
    }

    const monthName = monthNames[monthIndex];
    return `${dayOfMonth} ${monthName}`;
  }
}
