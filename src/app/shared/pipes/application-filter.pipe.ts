import { Pipe, PipeTransform } from '@angular/core';

import { ApplicationStatuses } from 'shared/enum/statuses';
import { Application } from 'shared/models/application.model';

@Pipe({
  name: 'applicationFilter',
  pure: false
})
export class ApplicationFilterPipe implements PipeTransform {
  public transform(array: Application[], statuses: string[]): Application[] {
    return array.filter((card) => statuses.find((status: string) => ApplicationStatuses[card.status] === ApplicationStatuses[status]));
  }
}
