import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyValueTransform'
})
export class EmptyValueTransformPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value : 'Не вказано';
  }
}
