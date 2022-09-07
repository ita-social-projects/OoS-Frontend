import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textTransform'
})
export class TextTransformPipe implements PipeTransform {


  transform(text: string): string {
    if (text.length > 10 && !text.includes(" ")) {
      const result = []
      for (let i = 0; i < text.length; i+=90) {
        result.push(text.slice(i, i + 90));
      }
      const resultString = result.toString().replace(/,/gi, ' ');
      return resultString
    }
    return text
  }
}
