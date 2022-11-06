import { Pipe, PipeTransform } from '@angular/core';
import { Application } from '../models/application.model';
import { Child } from '../models/child.model';

@Pipe({
  name: 'applicationChildFilter'
})
export class ApplicationChildFilterPipe implements PipeTransform {
  transform(applications: Application[], child: Child): Application[] {
    return applications.filter((application) => application.childId === child.id);
  }
}
