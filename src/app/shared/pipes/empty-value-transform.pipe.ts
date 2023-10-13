import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from 'shared/constants/constants';

@Pipe({
  name: 'emptyValueTransform'
})
export class EmptyValueTransformPipe implements PipeTransform {
  transform(value: string, args: string): string {
    if (args === Constants.DASH_VALUE) {
      return value ? value : '—';
    }

    return value ? value : 'SERVICE_MESSAGES.NO_INFO';
  }
}
