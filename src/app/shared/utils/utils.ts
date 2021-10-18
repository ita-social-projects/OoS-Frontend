import { map } from 'rxjs/internal/operators/map';
import { Child } from '../models/child.model';

/**
 *Utility class that providers methods for shared data manipulations
*/
export class Util {

  /**
   * This method returns child age
   * @param child Child
   * @returns string
   */
  public static getChildAge(child: Child): string {
    const today = new Date();
    const birthDate = new Date(child.dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age ? age.toString() + ' ' + 'років' : month.toString() + ' ' + 'місяців'; //TODO: add words declension
  }

  /**
  * This method returns array of empty element for aligning items in wrap
  * @param wrap Reference to wrapper
  * @param itemWidth width in pixels of item
  * @param items Observable or Array
  * @returns Array
  */
  public static getEmptyCards(wrap: any, itemWidth: number, items, itemsLength?): Array<any> {
    let amountCardsInRow = 0;
    let itemsArray = [];
    let amountWorkshops = 0;
    if (itemsLength) {
      amountWorkshops = itemsLength;
    } else {
      if (!Array.isArray(items) && items) {
        items.pipe(map(x => itemsArray.push(x))).subscribe();
        if (itemsArray[0]) {
          amountWorkshops = itemsArray[0].length;
        }
      }
      else if (items) {
        itemsArray = items.slice();
        amountWorkshops = itemsArray.length;
      }
    }
    if (wrap) {
      amountCardsInRow = Math.floor(Number((wrap.nativeElement.clientWidth) / itemWidth));
    }
    const emptyWorkshops = (amountCardsInRow - amountWorkshops % amountCardsInRow) !== amountCardsInRow ? (amountCardsInRow - amountWorkshops % amountCardsInRow) : 0;
    return new Array(emptyWorkshops | 0);
  }
}
