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
   * This method returns time in days and hours
   * @param seconds time in seconds
   * @returns string
   */

  public static secondsToDh(seconds: number): string {
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);        
    let dDisplay: string;
    let hDisplay;
    if(d > 0) {
      switch(d) {
        case 1: dDisplay = d + " день ";
        break;
        case 2:
        case 3:
        case 4: dDisplay = d + " дні ";
        break;
        default: dDisplay = d + " днів ";            
      }
    } else {
      dDisplay = "";
    };

    if(h > 0) {
      switch(h) {        
        case 1:
        case 21: hDisplay = h + " годину";
        break;
        case 2:
        case 3:        
        case 4:
        case 22:
        case 23:
        case 24: hDisplay = h + " години";
        break;
        default: hDisplay = h + " годин";            
      }
    } else {
      hDisplay = "";
    };
    return dDisplay + hDisplay;
    }

}


