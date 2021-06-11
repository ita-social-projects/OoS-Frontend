import { Pipe, PipeTransform } from '@angular/core';
import { Application } from '../models/application.model';

@Pipe({
  name: 'applicationFilter',
  pure: false
})
export class ApplicationFilterPipe implements PipeTransform {

  transform(array: Application[], status: string): Application[] {
    // return array.filter(card => card.status === status); TODO: add this functionality
    return array;

  }

}
