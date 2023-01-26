import { EmailConfirmationStatuses } from './../enum/statuses';
import { DefaultFilterState } from '../models/defaultFilterState.model';
import { FilterStateModel } from '../models/filterState.model';
import { MinistryAdmin } from '../models/ministryAdmin.model';
import { CodeMessageErrors } from '../enum/enumUA/errors';
import { PersonalCabinetTitle } from '../enum/navigation-bar';
import { Role } from '../enum/role';
import { Child } from '../models/child.model';
import { Person } from '../models/user.model';
import { UsersTable } from '../models/usersTable';
import { UserStatuses } from '../enum/statuses';
import { PaginationParameters } from '../models/queryParameters.model';
import { PaginationElement } from '../models/paginationElement.model';

/**
 * Utility class that providers methods for shared data manipulations
 */
export class Util {
  /**
   * This method returns child age
   * @param child Child
   * @returns string
   */
  public static getChildAge(child: Child): number {
    const today = new Date();
    const birthDate = new Date(child.dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * This method returns min birth date
   * @param maxAge number
   * @returns Date
   */
  public static getMinBirthDate(maxAge: number): Date {
    const today = new Date();
    const minBirthDate = new Date();

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
   * This method returns updated array structure for the table
   * @param users Users array of objects
   * @returns array of objects
   */
  public static updateStructureForTheTable(users): UsersTable[] {
    const updatedUsers = [];
    users.forEach((user) => {
      updatedUsers.push({
        id: user.id,
        pib: this.getFullName(user),
        email: user.parent.email,
        phoneNumber: user.parent.phoneNumber,
        role: user.isParent ? 'Батьки' : 'Діти',
        status: user.parent.emailConfirmed ? EmailConfirmationStatuses.Confirmed : EmailConfirmationStatuses.Pending
      });
    });
    return updatedUsers;
  }

  /**
   * This method returns updated array structure for the table
   * @param admins Admins array of objects
   * @returns array of objects
   */
  public static updateStructureForTheTableAdmins(admins: MinistryAdmin[]): UsersTable[] {
    const updatedAdmins = [];
    admins.forEach((admin: MinistryAdmin) => {
      updatedAdmins.push({
        id: admin.id,
        pib: this.getFullName(admin),
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        institutionTitle: admin.institutionTitle,
        status: admin.accountStatus || UserStatuses.Accepted
      });
    });
    return updatedAdmins;
  }

  /**
   * This method returns union message for the workshop updating
   * @param payload Object
   * @param message
   * @returns string
   */
  public static getWorkshopMessage(payload, message: string): { text: string; type: string } {
    const finalMessage = { text: '', type: 'success' };
    const messageArr = [];
    let isInvalidCoverImage = false;
    let isInvalidGaleryImages = false;
    let statuses, invalidImages;

    if (payload.uploadingCoverImageResult) {
      isInvalidCoverImage = !payload.uploadingCoverImageResult.result.succeeded;
    }

    if (payload.uploadingImagesResults?.results) {
      statuses = Object.entries(payload.uploadingImagesResults.results);
      invalidImages = statuses.filter((result) => !result[1]['succeeded']);
      isInvalidGaleryImages = !!invalidImages.length;
    }

    messageArr.push(message);

    if (isInvalidCoverImage) {
      const coverImageErrorMsg = payload.uploadingCoverImageResult?.result.errors
        .map((error) => `"${CodeMessageErrors[error.code]}"`)
        .join(', ');

      messageArr.push(`Помилка завантаження фонового зображення: ${coverImageErrorMsg}`);
      finalMessage.type = 'warningYellow';
    }

    if (isInvalidGaleryImages) {
      const errorCodes = new Set();
      invalidImages.map((img) => img[1]).forEach((img) => img['errors'].forEach((error) => errorCodes.add(error.code)));
      const errorMsg = [...errorCodes].map((error: string) => `"${CodeMessageErrors[error]}"`).join(', ');
      const indexes = invalidImages.map((img) => img[0]);
      const quantityMsg = indexes.length > 1 ? `у ${indexes.length} зображень` : `у ${+indexes[0] + 1}-го зображення`;

      messageArr.push(`Помилка завантаження ${quantityMsg} для галереї: ${errorMsg}`);
      finalMessage.type = 'warningYellow';
    }

    finalMessage.text = messageArr.join(';\n');

    return finalMessage;
  }

  public static getPersonalCabinetTitle(userRole, subrole): PersonalCabinetTitle {
    return userRole !== Role.provider ? PersonalCabinetTitle[userRole] : PersonalCabinetTitle[subrole];
  }

  public static getFullName(person: Person): string {
    return `${person.lastName} ${person.firstName} ${person.middleName}`;
  }

  /**
   * Create filter state query string depending on current and default filter values
   * As an alternative, it can be refactored to use JSON.stringify to serialize filterStateDiff object to string
   * @param filterState
   * @return Query string
   */
  public static getFilterStateQuery(filterState: FilterStateModel): string {
    let filterStateDiff: Partial<DefaultFilterState> = {};
    let serializedFilters = '';
    const defaultFilterState = new DefaultFilterState();

    // Compare current filter state and default
    for (let [key, value] of Object.entries(defaultFilterState)) {
      if (Array.isArray(filterState[key])) {
        if (filterState[key].length > 0) {
          filterStateDiff[key] = filterState[key].join();
        }
        continue;
      }
      if (value !== filterState[key]) {
        filterStateDiff[key] = filterState[key];
      }
    }
    // Create query string from filterStateDiff object
    Object.keys(filterStateDiff).forEach((key, index, keyArray) => {
      // Shouldn't add semicolon on last iteration
      if (index === keyArray.length - 1) {
        serializedFilters += `${key}=${filterStateDiff[key]}`;
      } else {
        serializedFilters += `${key}=${filterStateDiff[key]};`;
      }
    });

    return serializedFilters;
  }

  /**
   * Parse query string into filter state object to merge
   * As an alternative, it can be refactored to use JSON.parse serialized Filters query
   * @param params - filter parameter in url query string
   * @returns parsed string into Filter state object or empty object
   */
  public static parseFilterStateQuery(params: string): Partial<DefaultFilterState> {
    let filterState: Partial<DefaultFilterState> = {};

    if (!params) {
      return filterState;
    }

    params.split(';').forEach((param) => {
      const [key, value] = param.split('=');
      const arrayKeys = ['directionIds', 'workingDays', 'statuses'];
      // Check if key has value of type array
      if (arrayKeys.includes(key)) {
        filterState[key] = key !== 'directionIds' ? value.split(',') : value.split(',').map(Number);
      } else {
        filterState[key] = this.parseToPrimitive(value);
      }
    });
    return filterState;
  }

  public static setPaginationParams(params: PaginationParameters, currentPage: PaginationElement, itemsPerPage: number): void {
    params.size = itemsPerPage;
    params.from = (+currentPage.element - 1) * params.size;
  }

  /**
   * Parse string to the primitive value
   * @param value
   */
  private static parseToPrimitive(value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value.toString();
    }
  }
}
