import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationStatus } from '../enum/applications';
import { Application } from '../models/application.model';

@Pipe({
  name: 'applicationSort',
  pure: false
})
export class ApplicationSortPipe implements PipeTransform {

  readonly applicationStatus = ApplicationStatus;

  transform(array: Application[], status?: string, date?: string): Application[] {

    return array.sort((a, b) => {
      // firstly sort according to the property status 'new'
      if (a.status === this.applicationStatus.approved && b.status !== this.applicationStatus.approved)
        return -1;

      if (a.status !== this.applicationStatus.approved && b.status === this.applicationStatus.approved)
        return 1;

      // if both objects has the same status sort according to the title
      if (a.status === this.applicationStatus.approved && b.status === this.applicationStatus.approved)
        return (a.creationTime < b.creationTime) ? -1 : 1;

      //the rest sorts according to the last date
      return (a.creationTime < b.creationTime) ? -1 : 1;
    });
    return array;
  }

}
