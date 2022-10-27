import { Pipe, PipeTransform } from '@angular/core';
import { Statuses } from '../enum/applications';
import { Application } from '../models/application.model';

@Pipe({
  name: 'applicationFilter',
  pure: false
})
export class ApplicationFilterPipe implements PipeTransform {
  readonly applicationStatus = Statuses;

  transform(array: Application[], statuses: string[]): Application[] {
    return array.filter((card) =>
      statuses.find(
        (status: string) =>
          this.applicationStatus[card.status] === this.applicationStatus[status]
      )
    );
  }
}
