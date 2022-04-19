import { Pipe, PipeTransform } from '@angular/core';
import { FirstCase, SecondCase, ThirdCase } from '../enum/enumUA/declination';

@Pipe({
  name: 'declination'
})
export class DeclinationPipe implements PipeTransform {

  transform(quantity: number, word: string): string {

    const lastDigit = +(quantity.toString().slice(-1));
    let declination = word;

    if (lastDigit === 1) declination = FirstCase[word]
    else if (lastDigit >= 2 && lastDigit <= 4) declination = SecondCase[word]
    else declination = ThirdCase[word]
    
    return `${quantity} ${declination}`
  }

}
