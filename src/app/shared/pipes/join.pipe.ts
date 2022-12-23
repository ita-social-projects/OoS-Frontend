import { Pipe, PipeTransform } from '@angular/core';
import { DataItem } from '../models/item.model';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(input: DataItem[], propertyName: string, sep = ', '): string {
    return input.map((value: DataItem) => value[propertyName]).join(sep);
  }
}
