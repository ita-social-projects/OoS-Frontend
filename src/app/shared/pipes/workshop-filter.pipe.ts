import { Pipe, PipeTransform } from '@angular/core';
import { Application } from '../models/application.model';
import { Workshop } from '../models/workshop.model';

@Pipe({
  name: 'workshopFilter'
})
export class WorkshopFilterPipe implements PipeTransform {

  transform(applications: Application[], workshops: Workshop[]): Application[] {
    if (workshops?.length) {
      return applications.filter(application => workshops.find(workshop => workshop.id === application.workshopId));
    }
    return applications;
  }

}
