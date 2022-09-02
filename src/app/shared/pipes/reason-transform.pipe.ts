import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reasonTransform'
})
export class ReasonTransformPipe implements PipeTransform {


  transform(reason: string): string {
    if (reason.length > 10 && !reason.includes(" ")) {
      const result = []
      for (let i = 0; i < reason.length; i+=90) {
        result.push(reason.slice(i, i + 90));
      }
      const resultString = result.toString().replace(/,/gi, ' ');
      return resultString
    }
    return reason
  }
}
