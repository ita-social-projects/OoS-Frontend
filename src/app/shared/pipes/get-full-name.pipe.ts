import { Pipe, PipeTransform } from '@angular/core';
import { Person } from '../models/user.model';

@Pipe({
  name: 'getFullName'
})
export class GetFullNamePipe implements PipeTransform {
  public transform(person: Person): string {
    return `${person.lastName} ${person.firstName} ${person.middleName}`;
  }
}
