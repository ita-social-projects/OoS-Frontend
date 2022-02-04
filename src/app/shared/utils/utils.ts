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
  
    return (age < 1) ? '<1 року' :  age.toString() + ' ' + this.getDeclensionYear(age);
  }

  /**
   * This method returns min birth date
   * @param maxAge number
   * @returns Date
   */
     public static getMinBirthDate(maxAge: number): Date {
      const today = new Date();
      let minBirthDate = new Date();

      minBirthDate.setFullYear(today.getFullYear() - maxAge);
  
      return minBirthDate;
    }

  /**
   * This method returns max birth date
   * @returns Date
   */
   public static getMaxBirthDate(): Date {
    const today = new Date();

    return today;
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
}
