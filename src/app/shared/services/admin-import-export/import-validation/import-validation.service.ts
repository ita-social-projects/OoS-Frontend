import { Injectable } from '@angular/core';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { EDRPOU_IPN_REGEX, EMAIL_REGEX, NO_LATIN_REGEX, STREET_REGEX } from 'shared/constants/regex-constants';
import { EmailsEdrpousResponse, ProviderId } from 'shared/models/admin-import-export.model';

@Injectable({
  providedIn: 'root'
})
export class ImportValidationService {
  constructor() {}
  public checkForInvalidData(providers: ProviderId[], emailsEdrpous: EmailsEdrpousResponse): void {
    providers.forEach((elem) => {
      elem.errors = {};
      this.validateDirectorsName(elem);
      this.validateDirectorsSurname(elem);
      this.validateProviderName(elem);
      this.validateOwnership(elem);
      this.validateIdentifier(elem, emailsEdrpous);
      this.validateLicenseNumber(elem);
      this.validateSettlement(elem);
      this.validateAddress(elem);
      this.validateEmail(elem, emailsEdrpous);
      this.validatePhoneNumber(elem);
    });
  }

  public validateDirectorsName(elem: ProviderId): void {
    if (!elem.directorsName) {
      elem.errors.directorsNameEmpty = true;
    }
  }

  public validateDirectorsSurname(elem: ProviderId): void {
    if (!elem.directorsSurname) {
      elem.errors.directorsSurnameEmpty = true;
    }
  }

  public validateProviderName(elem: ProviderId): void {
    if (!elem.providerName) {
      elem.errors.providerNameEmpty = true;
    } else if (elem.providerName.length <= 1 || elem.providerName.length > 60) {
      elem.errors.providerNameLength = true;
    }
  }

  public validateOwnership(elem: ProviderId): void {
    if (!elem.ownership) {
      elem.errors.ownershipEmpty = true;
    }
  }

  public validateIdentifier(elem: ProviderId, emailsEdrpous: EmailsEdrpousResponse): void {
    if (!elem.identifier) {
      elem.errors.identifierEmpty = true;
    } else if (!EDRPOU_IPN_REGEX.test(elem.identifier.toString())) {
      elem.errors.identifierFormat = true;
    } else if (emailsEdrpous.edrpous.includes(elem.id)) {
      elem.errors.identifierDuplicate = true;
    }
  }

  // type of license number is number
  public validateLicenseNumber(elem: ProviderId): void {
    if (!elem.licenseNumber) {
      elem.errors.licenseNumberEmpty = true;
    }
  }

  public validateSettlement(elem: ProviderId): void {
    if (!elem.settlement) {
      elem.errors.settlementEmpty = true;
    } else if (elem.settlement.length <= 1 || elem.settlement.length > 60) {
      elem.errors.settlementLength = true;
    } else if (!NO_LATIN_REGEX.test(elem.settlement)) {
      elem.errors.settlementLanguage = true;
    }
  }

  public validateAddress(elem: ProviderId): void {
    if (!elem.address) {
      elem.errors.addressEmpty = true;
    } else if (!STREET_REGEX.test(elem.address)) {
      elem.errors.addressLanguage = true;
    }
  }

  public validateEmail(elem: ProviderId, emailsEdrpous: EmailsEdrpousResponse): void {
    if (!elem.email) {
      elem.errors.emailEmpty = true;
    } else if (!EMAIL_REGEX.test(elem.email)) {
      elem.errors.emailFormat = true;
    } else if (emailsEdrpous.emails.includes(elem.id)) {
      elem.errors.emailDuplicate = true;
    }
  }

  public validatePhoneNumber(elem: ProviderId): void {
    if (!elem.phoneNumber) {
      elem.errors.phoneNumberEmpty = true;
    } else if (!isValidPhoneNumber(elem.phoneNumber.toString(), 'UA')) {
      elem.errors.phoneNumberFormat = true;
    }
  }
}
