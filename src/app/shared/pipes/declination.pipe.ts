import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'declination'
})
export class DeclinationPipe implements PipeTransform {

  transform(quantity: number, words): string {

    const lastDigit = +(quantity.toString().slice(-1));
    let declination = words[2];

    if (lastDigit === 1) declination = words[0]
    else if (lastDigit >= 2 && lastDigit <= 4) declination = words[1]
    else declination = words[2]
    
    return `${quantity} ${declination}`
  }

}
