import { Pipe, PipeTransform } from '@angular/core';
import { Application } from '../models/application.model';
import { ApplicationStatuses } from './../enum/statuses';

@Pipe({
  name: 'applicationFilter',
  pure: false
})
export class ApplicationFilterPipe implements PipeTransform {
  readonly statuses = ApplicationStatuses;

  transform(array: Application[], statuses: string[]): Application[] {
    return array.filter((card) => statuses.find((status: string) => this.statuses[card.status] === this.statuses[status]));
  }
}
