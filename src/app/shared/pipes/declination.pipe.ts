import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'declination'
})
export class DeclinationPipe implements PipeTransform {

  transform(quantity: number, words): string {

    const lastDigit = quantity ? +(quantity.toString().slice(-1)) : 0;
    const isUnique = (quantity >= 11 && quantity <= 14);
    const finalNumber = (quantity === 0 && words[3]) ? '' : quantity;
    let declination = words ? words[2] : '';

    if (isUnique) declination = words[2]
    else if (lastDigit === 1) declination = words[0]
    else if (lastDigit >= 2 && lastDigit <= 4) declination = words[1]
    else if (quantity === 0) declination = (words[3]) ? words[3] : words[2];
    else declination = !!words ? words[2] : '';
    
    return `${finalNumber} ${declination}`
  }

}
