import { Pipe, PipeTransform } from '@angular/core';
import { SocialGroup } from '../models/socialGroup.model';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  transform(input: Array<SocialGroup>, propertyName: string, sep = ', '): string {
    return input.map((value) => value[propertyName]).join(sep);
  }
}
