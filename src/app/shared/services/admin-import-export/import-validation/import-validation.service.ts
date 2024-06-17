import { Injectable } from '@angular/core';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { EDRPOU_IPN_REGEX, EMAIL_REGEX, NO_LATIN_REGEX, STREET_REGEX } from 'shared/constants/regex-constants';
import { EmailsEdrpousResponse, ProvidersID } from 'shared/models/admin-import-export.model';

@Injectable({
  providedIn: 'root'
})
export class ImportValidationService {
  constructor() {}
  public checkForInvalidData(providers: ProvidersID[], emailsEdrpous: EmailsEdrpousResponse): void {
    providers.forEach((elem) => {
      elem.errors = {};
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

  public validateProviderName(elem: ProvidersID): void {
    if (!elem.providerName) {
      elem.errors.providerNameEmpty = true;
    } else if (elem.providerName.length <= 1 || elem.providerName.length > 60) {
      elem.errors.providerNameLength = true;
    }
  }

  public validateOwnership(elem: ProvidersID): void {
    if (!elem.ownership) {
      elem.errors.ownershipEmpty = true;
    }
  }

  public validateIdentifier(elem: ProvidersID, emailsEdrpous: EmailsEdrpousResponse): void {
    if (!elem.identifier) {
      elem.errors.identifierEmpty = true;
    } else if (!EDRPOU_IPN_REGEX.test(elem.identifier.toString())) {
      elem.errors.identifierFormat = true;
    } else if (emailsEdrpous.edrpous.includes(elem.id)) {
      elem.errors.identifierDuplicate = true;
    }
  }

  // type of license number is number
  public validateLicenseNumber(elem: ProvidersID): void {
    if (!elem.licenseNumber) {
      elem.errors.licenseNumberEmpty = true;
    }
  }

  public validateSettlement(elem: ProvidersID): void {
    if (!elem.settlement) {
      elem.errors.settlementEmpty = true;
    } else if (elem.settlement.length <= 1 || elem.settlement.length > 60) {
      elem.errors.settlementLength = true;
    } else if (!NO_LATIN_REGEX.test(elem.settlement)) {
      elem.errors.settlementLanguage = true;
    }
  }

  public validateAddress(elem: ProvidersID): void {
    if (!elem.address) {
      elem.errors.addressEmpty = true;
    } else if (!STREET_REGEX.test(elem.address)) {
      elem.errors.addressLanguage = true;
    }
  }

  public validateEmail(elem: ProvidersID, emailsEdrpous: EmailsEdrpousResponse): void {
    if (!elem.email) {
      elem.errors.emailEmpty = true;
    } else if (!EMAIL_REGEX.test(elem.email)) {
      elem.errors.emailFormat = true;
    } else if (emailsEdrpous.emails.includes(elem.id)) {
      elem.errors.emailDuplicate = true;
    }
  }

  public validatePhoneNumber(elem: ProvidersID): void {
    if (!elem.phoneNumber) {
      elem.errors.phoneNumberEmpty = true;
    } else if (!isValidPhoneNumber(elem.phoneNumber.toString(), 'UA')) {
      elem.errors.phoneNumberFormat = true;
    }
  }
}
