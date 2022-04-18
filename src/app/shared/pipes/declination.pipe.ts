import { Pipe, PipeTransform } from '@angular/core';
import { More, One, Two } from '../enum/enumUA/declination';

@Pipe({
  name: 'declination'
})
export class DeclinationPipe implements PipeTransform {

  transform(quantity: number, word: string): string {
    switch (quantity) {
      case 1:
        return One[word]
        break;
      case 2: 
        return Two[word]
        break;
      default:
        return `${quantity} ${More[word]}`;
    }
  }

}
