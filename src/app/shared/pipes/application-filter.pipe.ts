import { Pipe, PipeTransform } from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ApplicationStatus } from '../enum/applications';
import { Application } from '../models/application.model';

@Pipe({
  name: 'applicationFilter',
  pure: false
})
export class ApplicationFilterPipe implements PipeTransform {

  readonly applicationStatus = ApplicationStatus;

  transform(array: Application[], statuses: string[]): Application[] {
    return array.filter(card => statuses.find((status: string) => this.applicationStatus[card.status] === this.applicationStatus[status]));
  }

}
