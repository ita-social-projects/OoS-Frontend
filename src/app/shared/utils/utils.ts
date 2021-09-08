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
}
