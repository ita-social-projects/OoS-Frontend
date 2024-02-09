import { KeyValue } from '@angular/common';

import { CodeMessageErrors } from 'shared/enum/enumUA/errors';
import { Localization } from 'shared/enum/enumUA/localization';
import { PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { ProviderAdminTitles } from 'shared/enum/enumUA/provider-admin';
import { UserTabsTitles } from 'shared/enum/enumUA/user';
import { Role, Subrole } from 'shared/enum/role';
import { EmailConfirmationStatuses, UserStatuses } from 'shared/enum/statuses';
import { BaseAdmin } from 'shared/models/admin.model';
import { AreaAdmin } from 'shared/models/area-admin.model';
import { Child } from 'shared/models/child.model';
import { DefaultFilterState } from 'shared/models/default-filter-state.model';
import { FilterStateModel } from 'shared/models/filter-state.model';
import { MessageBarData } from 'shared/models/message-bar.model';
import { MinistryAdmin } from 'shared/models/ministry-admin.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { ProviderAdmin } from 'shared/models/provider-admin.model';
import { PaginationParameters } from 'shared/models/query-parameters.model';
import { Person } from 'shared/models/user.model';
import { AdminsTableData, ProviderAdminsTableData, UsersTableData } from 'shared/models/users-table';
import { Workshop } from 'shared/models/workshop.model';

/**
 * Utility class that providers methods for shared data manipulations
 */
export class Util {
  /**
   * This method returns current localization as a number for backend requests
   * <br>
   * Locale string can be passed as param or by default it is taken from local storage,
   * but it is required to provide locale if calling from a language change event
   * because storage gives the previous locale
   * <br>
   * Ukrainian locale is 0 and English is 1
   * @param locale Locale string (uk, en)
   */
  public static getCurrentLocalization(locale: string = localStorage.getItem('ui-culture') || 'uk'): number {
    return Localization[locale];
  }

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
  public static getMaxBirthDate(minAge: number): Date {
    const today = new Date();
    const maxBirthDate = new Date();

    maxBirthDate.setFullYear(today.getFullYear() - minAge);

    return maxBirthDate;
  }

  public static getTodayBirthDate(): Date {
    return new Date();
  }

  /**
   * This method returns updated array structure for the table
   * @param users Users array of objects
   * @returns array of objects
   */
  public static updateStructureForTheTable(users: Child[]): UsersTableData[] {
    const updatedUsers = [];
    users.forEach((user) => {
      updatedUsers.push({
        id: user.id,
        pib: this.getFullName(user),
        email: user.parent.email,
        phoneNumber: user.parent.phoneNumber,
        role: user.isParent ? UserTabsTitles.parent : UserTabsTitles.child,
        status: user.parent.emailConfirmed ? EmailConfirmationStatuses.Confirmed : EmailConfirmationStatuses.Pending,
        isBlocked: user.parent.isBlocked,
        parentId: user.parentId,
        parentFullName: this.getFullName(user.parent)
      });
    });
    return updatedUsers;
  }

  /**
   * This method returns updated array structure for the table
   * @param admins Admins array of objects
   * @returns array of objects
   */
  public static updateStructureForTheTableAdmins(admins: MinistryAdmin[]): AdminsTableData[] {
    const updatedAdmins = [];
    admins.forEach((admin: BaseAdmin) => {
      updatedAdmins.push({
        id: admin.id,
        pib: this.getFullName(admin),
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        institutionTitle: admin.institutionTitle,
        status: admin.accountStatus || UserStatuses.Accepted,
        catottgName: admin.catottgName,
        regionName: (admin as AreaAdmin).regionName ?? admin.catottgName,
        isAdmin: true
      });
    });
    return updatedAdmins;
  }

  /**
   * This method returns updated array structure for the Provider Admin table
   * @param admins ProviderAdmin[]
   * @returns array of objects
   */
  public static updateStructureForTheTableProviderAdmins(admins: ProviderAdmin[]): ProviderAdminsTableData[] {
    const updatedProviderAdmins = [];
    admins.forEach((admin: ProviderAdmin) => {
      updatedProviderAdmins.push({
        id: admin.id,
        pib: `${admin.lastName} ${admin.firstName} ${admin.middleName}`,
        email: admin.email,
        phoneNumber: `${admin.phoneNumber}`,
        role: admin.isDeputy ? ProviderAdminTitles.Deputy : ProviderAdminTitles.Admin,
        status: admin.accountStatus,
        isDeputy: admin.isDeputy
      });
    });
    return updatedProviderAdmins;
  }

  /**
   * This method returns union message for the workshop updating
   * @param payload Object
   * @param message
   * @returns string
   */
  // TODO: Update type for payload
  public static getWorkshopMessage(payload: Workshop & any, message: string): MessageBarData {
    const finalMessage: MessageBarData = { message: '', type: 'success' };
    const messageArr = [];
    let isInvalidCoverImage = false;
    let isInvalidGalleryImages = false;
    let statuses;
    let invalidImages;

    if (payload.uploadingCoverImageResult) {
      isInvalidCoverImage = !payload.uploadingCoverImageResult.result.succeeded;
    }

    if (payload.uploadingImagesResults?.results) {
      statuses = Object.entries(payload.uploadingImagesResults.results);
      invalidImages = statuses.filter((result) => !result[1].succeeded);
      isInvalidGalleryImages = !!invalidImages.length;
    }

    messageArr.push(message);

    if (isInvalidCoverImage) {
      const coverImageErrorMsg = payload.uploadingCoverImageResult?.result.errors
        .map((error) => `"${CodeMessageErrors[error.code]}"`)
        .join(', ');

      messageArr.push(`Помилка завантаження фонового зображення: ${coverImageErrorMsg}`);
      finalMessage.type = 'warningYellow';
    }

    if (isInvalidGalleryImages) {
      const errorCodes = new Set();
      invalidImages.map((img) => img[1]).forEach((img) => img.errors.forEach((error) => errorCodes.add(error.code)));
      const errorMsg = [...errorCodes].map((error: string) => `"${CodeMessageErrors[error]}"`).join(', ');
      const indexes = invalidImages.map((img) => img[0]);
      const quantityMsg = indexes.length > 1 ? `у ${indexes.length} зображень` : `у ${+indexes[0] + 1}-го зображення`;

      messageArr.push(`Помилка завантаження ${quantityMsg} для галереї: ${errorMsg}`);
      finalMessage.type = 'warningYellow';
    }

    finalMessage.message = messageArr.join(';\n');

    return finalMessage;
  }

  public static getPersonalCabinetTitle(userRole: Role, subrole: Subrole): PersonalCabinetTitle {
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
    const filterStateDiff: Partial<DefaultFilterState> = {};
    let serializedFilters = '';
    const defaultFilterState = new DefaultFilterState();

    // Compare current filter state and default
    for (const [key, value] of Object.entries(defaultFilterState)) {
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
    const filterState: Partial<DefaultFilterState> = {};

    if (!params) {
      return filterState;
    }

    params.split(';').forEach((param) => {
      const [key, value] = param.split('=');
      const arrayKeys = ['directionIds', 'workingDays', 'formsOfLearning', 'statuses'];
      // Check if key has value of type array
      if (arrayKeys.includes(key)) {
        filterState[key] = key !== 'directionIds' ? value.split(',') : value.split(',').map(Number);
      } else {
        filterState[key] = this.parseToPrimitive(value);
      }
    });
    return filterState;
  }

  public static setFromPaginationParam(params: PaginationParameters, currentPage: PaginationElement, totalAmount: number): void {
    const from = this.calculateFromParameter(currentPage, params.size);
    if (!totalAmount || totalAmount >= from) {
      params.from = from;
    } else {
      currentPage.element = Math.ceil(totalAmount / params.size);
      params.from = this.calculateFromParameter(currentPage, params.size);
    }
  }

  /**
   * Used with `keyvalue` pipe for sorting keys in numerical order instead of alphanumeric
   */
  public static keyValueNumericSorting(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
    return a.key > b.key ? -1 : b.key > a.key ? 1 : 0;
  }

  private static calculateFromParameter(currentPage: PaginationElement, size: number): number {
    return (+currentPage.element - 1) * size;
  }

  /**
   * Parse string to the primitive value
   * @param value
   */
  private static parseToPrimitive(value: string): string {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value.toString();
    }
  }
}
