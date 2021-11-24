import { map } from 'rxjs/internal/operators/map';
import { Child } from '../models/child.model';

/**
 * Utility class that providers methods for shared data manipulations
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

    return age ? age.toString() + ' ' + this.getDeclensionYear(age) : month.toString() + ' ' + this.getDeclensionMonth(month);
  }

  /**
   * This method returns declension for Child's age in years
   * @param year Child's age in years
   * @returns string
   */
  public static getDeclensionYear(year: number): string {
    let ageString;
    let lastDigit = year % 10;
    (lastDigit === 1 && year !== 11) ? ageString = 'рік' : (lastDigit > 1 && lastDigit < 5) ? ageString = 'роки' : ageString = 'років';
    return ageString;
  }

  /**
   * This method returns declension for Child's age in months
   * @param month Child's age in months
   * @returns string
   */
  public static getDeclensionMonth(month: number): string {
    let ageString;
    (month === 1) ? ageString = 'місяць' : (month > 1 && month < 5) ? ageString = 'місяці' : ageString = 'місяців';
    return ageString;
  }
}
