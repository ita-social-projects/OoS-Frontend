import { map } from 'rxjs/internal/operators/map';
import { Constants } from '../constants/constants';
import { Child } from '../models/child.model';
import { UsersTable } from '../models/usersTable';

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

    return (age < 1) ? '<1 року' : age.toString() + ' ' + this.getDeclensionYear(age);
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

  /**
   * This method returns time in days and hours
   * @param seconds time in seconds
   * @returns string
   */

  public static secondsToDh(seconds: number): string {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.ceil(seconds % (3600 * 24) / 3600);
    let dDisplay: string;
    let hDisplay;
    if (d > 0) {
      switch (d) {
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

    if (h > 0) {
      switch (h) {
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

  /**
   * This method returns updated array structure for the table
   * @param users Users array of objects
   * @returns array of objects
   */
  public static updateStructureForTheTable(users): UsersTable[] {
  const constants: typeof Constants = Constants;
  let updatedUsers = [];
  users.forEach((user) => {
    updatedUsers.push({
      id: user.id,
      pib: `${user.lastName} ${user.firstName} ${user.middleName}` || constants.NO_INFORMATION,
      email: user.email || constants.NO_INFORMATION,
      place: user.place || constants.NO_INFORMATION,
      phoneNumber: user.phoneNumber ? `${constants.PHONE_PREFIX} ${user.phoneNumber}` : constants.NO_INFORMATION,
      role: user.parentId ? 'Діти' : 'Батьки',
      status: user.accountStatus || 'Accepted',
    });
  });
  return updatedUsers;
}
}
