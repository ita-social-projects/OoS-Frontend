import { map } from 'rxjs/internal/operators/map';
import { Constants } from '../constants/constants';
import { CodeMessageErrors } from '../enum/enumUA/errors';
import { PersonalCabinetTitle } from '../enum/navigation-bar';
import { Role } from '../enum/role';
import { Child } from '../models/child.model';
import { Parent, ParentWithContactInfo } from '../models/parent.model';
import { Provider } from '../models/provider.model';
import { ProviderAdmin } from '../models/providerAdmin.model';
import { Teacher } from '../models/teacher.model';
import { Person } from '../models/user.model';
import { UsersTable } from '../models/usersTable';
import { RegistrationState } from '../store/registration.state';

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

    return age < 1 ? '<1 року' : age.toString() + ' ' + this.getDeclensionYear(age);
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
    lastDigit === 1 && year !== 11
      ? (ageString = 'рік')
      : lastDigit > 1 && lastDigit < 5
      ? (ageString = 'роки')
      : (ageString = 'років');
    return ageString;
  }

  /**
   * This method returns time in days and hours
   * @param seconds time in seconds
   * @returns string
   */

  public static secondsToDh(seconds: number): string {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.ceil((seconds % (3600 * 24)) / 3600);
    let dDisplay: string;
    let hDisplay;
    if (d > 0) {
      switch (d) {
        case 1:
          dDisplay = d + ' день ';
          break;
        case 2:
        case 3:
        case 4:
          dDisplay = d + ' дні ';
          break;
        default:
          dDisplay = d + ' днів ';
      }
    } else {
      dDisplay = '';
    }

    if (h > 0) {
      switch (h) {
        case 1:
        case 21:
          hDisplay = h + ' годину';
          break;
        case 2:
        case 3:
        case 4:
        case 22:
        case 23:
        case 24:
          hDisplay = h + ' години';
          break;
        default:
          hDisplay = h + ' годин';
      }
    } else {
      hDisplay = '';
    }
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
    users.forEach(user => {
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

  /**
   * This method returns union message for the workshop updating
   * @param payload Object
   * @returns string
   */
  public static getWorkshopMessage(payload) {
    let finalMessage = { text: '', type: 'success' };
    let messageArr = [];

    let isInvalidCoverImage = false;
    let isInvalidGaleryImages = false;
    let statuses, invalidImages;

    if (payload.uploadingCoverImageResult) {
      isInvalidCoverImage = !payload.uploadingCoverImageResult.result.succeeded;
    }

    if (payload.uploadingImagesResults?.results) {
      statuses = Object.entries(payload.uploadingImagesResults.results);
      invalidImages = statuses.filter(result => !result[1]['succeeded']);
      isInvalidGaleryImages = !!invalidImages.length;
    }

    messageArr.push(`Гурток оновлено!`);

    if (isInvalidCoverImage) {
      const coverImageErrorMsg = payload.uploadingCoverImageResult?.result.errors
        .map(error => `"${CodeMessageErrors[error.code]}"`)
        .join(', ');

      messageArr.push(`Помилка завантаження фонового зображення: ${coverImageErrorMsg}`);
      finalMessage.type = 'warningYellow';
    }

    if (isInvalidGaleryImages) {
      let errorCodes = new Set();
      invalidImages.map(img => img[1]).forEach(img => img['errors'].forEach(error => errorCodes.add(error.code)));
      const errorMsg = [...errorCodes].map((error: string) => `"${CodeMessageErrors[error]}"`).join(', ');
      const indexes = invalidImages.map(img => img[0]);
      const quantityMsg = indexes.length > 1 ? `у ${indexes.length} зображень` : `у ${+indexes[0] + 1}-го зображення`;

      messageArr.push(`Помилка завантаження ${quantityMsg} для галереї: ${errorMsg}`);
      finalMessage.type = 'warningYellow';
    }

    finalMessage.text = messageArr.join(';\n');

    return finalMessage;
  }

  public static getPersonalCabinetTitle(userRole, subrole): PersonalCabinetTitle {
    return (userRole !== Role.provider) ? PersonalCabinetTitle[userRole] : PersonalCabinetTitle[subrole];
  }

  public static getFullName( person: Person): string {
    return `${person.lastName} ${person.firstName} ${person.middleName}`;
  }
}
