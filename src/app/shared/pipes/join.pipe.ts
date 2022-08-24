import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(input: Array<any>, propertyName: string, sep = ', '): string {
    return input.map(value => value[propertyName]).join(sep);
  }
}
