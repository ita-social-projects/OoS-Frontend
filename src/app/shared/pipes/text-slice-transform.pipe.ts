import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textSliceTransform'
})
export class TextSliceTransformPipe implements PipeTransform {


  transform(text: string): string {
    if (text.length > 10 && !text.includes(" ")) {
      const result = []
      for (let i = 0; i < text.length; i+=97) {
        result.push(text.slice(i, i + 97));
      }
      const resultString = result.toString().replace(/,/gi, ' ');
      return resultString
    }
    return text
  }
}
