import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from 'shared/constants/constants';

@Pipe({
  name: 'emptyValueTransform'
})
export class EmptyValueTransformPipe implements PipeTransform {
  public transform(value: string, args: string): string {
    if (!value) {
      if (args === Constants.DASH_VALUE) {
        return Constants.DASH;
      }
      return 'SERVICE_MESSAGES.NO_INFO';
    }

    return value;
  }
}
