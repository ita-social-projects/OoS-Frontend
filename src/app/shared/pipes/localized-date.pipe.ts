import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  public transform(value: string | null | undefined): string | null {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthNames: string[] | string = this.translate.instant('MONTHS.NAMES');
    const monthName = monthNames[monthIndex];
    return `${day} ${monthName}`;
  }
}
