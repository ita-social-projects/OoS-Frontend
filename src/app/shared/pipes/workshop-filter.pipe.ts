import { Pipe, PipeTransform } from '@angular/core';
import { Application } from '../models/application.model';
import { Workshop } from '../models/workshop.model';

@Pipe({
  name: 'workshopFilter'
})
export class WorkshopFilterPipe implements PipeTransform {

  transform(applications: Application[], workshops: Workshop[]): unknown {
    if (workshops?.length) {
      return applications.filter(application => workshops.filter(workshop => application.workshopId === workshop.id))
    }
    return applications;
  }

}
