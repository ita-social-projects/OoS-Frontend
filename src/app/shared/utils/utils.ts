import { Observable } from "rxjs";
import { map } from "rxjs/internal/operators/map";
import { Child } from "../models/child.model";

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
   * @param items Observable 
   * @returns Array
   */
  public static emptyItems(wrap: any, itemWidth: number, items$: Observable<any>): Array<any> {
    let amountCardsInRow = 0;
    let itemsArray = [];
    let amountWorkshops = 0;
    items$.pipe(map(x => itemsArray.push(x))).subscribe();
    if (itemsArray[0]) {
      amountWorkshops = itemsArray[0].length;
    }
    if (wrap) {
      amountCardsInRow = Math.floor(Number((wrap.nativeElement.clientWidth) / itemWidth));
    }
    let emptyWorkshops = (amountCardsInRow - amountWorkshops % amountCardsInRow) !== amountCardsInRow ? (amountCardsInRow - amountWorkshops % amountCardsInRow) : 0;
    return new Array(emptyWorkshops | 0);
  }
}
