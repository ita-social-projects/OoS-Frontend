import { Pipe, PipeTransform } from '@angular/core';
import { Statuses } from '../enum/statuses';
import { Application } from '../models/application.model';

@Pipe({
  name: 'applicationFilter',
  pure: false
})
export class ApplicationFilterPipe implements PipeTransform {
  readonly statuses = Statuses;

  transform(array: Application[], statuses: string[]): Application[] {
    return array.filter((card) => statuses.find((status: string) => this.statuses[card.status] === this.statuses[status]));
  }
}
