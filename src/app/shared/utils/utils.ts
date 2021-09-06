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
    let timeDiff = Math.abs(Date.now() - (new Date(child.dateOfBirth)).getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    return age && age.toString() + ' ' + 'років';
  }
}
