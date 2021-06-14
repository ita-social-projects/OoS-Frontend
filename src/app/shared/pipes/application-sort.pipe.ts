import { Pipe, PipeTransform } from '@angular/core';
import { Application } from '../models/application.model';

@Pipe({
  name: 'applicationSort',
  pure: false
})
export class ApplicationSortPipe implements PipeTransform {
  transform(array: Application[], status?: string, date?: string): Application[] {

    // return array.sort((a, b) => {
    //   // firstly sort according to the property status 'new'
    //   if (a.status === 'new' && b.status !== 'new')
    //     return -1;

    //   if (a.status !== 'new' && b.status === 'new')
    //     return 1;

    //   // if both objects has the same status sort according to the title
    //   if (a.status === 'new' && b.status === 'new')
    //     return (a.date < b.date) ? -1 : 1;

    //   //the rest sorts according to the last date
    //   return (a.date < b.date) ? -1 : 1;
    // }); TODO: add this functionality
    return array;
  }

}
