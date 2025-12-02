import { Pipe, PipeTransform } from '@angular/core';
import { DataItem } from '../models/item.model';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  public transform(input: DataItem[], propertyName: string, sep: string = ', '): string {
    return input.map((value: DataItem) => value[propertyName]).join(sep);
  }
}
