import { TestBed } from '@angular/core/testing';
import { ProviderId } from 'shared/models/admin-import-export.model';
import { ImportValidationService } from './import-validation.service';

describe('ImportValidationService', () => {
  const emailsEdrpous = {
    edrpous: [2],
    emails: [3]
  };
  const providersErrorsMock: ProviderId[] = [
    {
      directorsName: null,
      directorsSurname: null,
      providerName: null,
      ownership: null,
      identifier: null,
      licenseNumber: null,
      settlement: null,
      address: null,
      email: null,
      phoneNumber: null,
      id: 1,
      errors: {}
    },
    {
      directorsName: 'Степан',
      directorsSurname: 'Худий',
      providerName: 'К',
      ownership: 'Державна',
      identifier: 12345678,
      licenseNumber: 123445,
      settlement: 'Л',
      address: 'Shevchenko',
      email: 'somegmail.com',
      phoneNumber: 660666,
      id: 2,
      errors: {}
    },
    {
      directorsName: 'Степан',
      directorsSurname: 'Худий',
      providerName: 'К',
      ownership: 'Державна',
      identifier: 12345,
      licenseNumber: 123445,
      settlement: 'lutsk',
      address: 'Шевченка 2',
      email: 'some@gmail.com',
      phoneNumber: 660666066,
      id: 3,
      errors: {}
    }
  ];
  let service: ImportValidationService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportValidationService);
  });
  afterEach(() => {
    providersErrorsMock.forEach((provider) => (provider.errors = {}));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('checkForInvalidData method should correctly process the providers and update errors', () => {
    const providers: ProviderId[] = [
      {
        directorsName: null,
        directorsSurname: null,
        providerName: null,
        ownership: null,
        identifier: null,
        licenseNumber: null,
        settlement: null,
        address: null,
        email: null,
        phoneNumber: null,
        id: 1,
        errors: {}
      }
    ];
    service.checkForInvalidData(providers, emailsEdrpous);
    const expected = {
      directorsNameEmpty: true,
      directorsSurnameEmpty: true,
      providerNameEmpty: true,
      ownershipEmpty: true,
      identifierEmpty: true,
      licenseNumberEmpty: true,
      settlementEmpty: true,
      addressEmpty: true,
      emailEmpty: true,
      phoneNumberEmpty: true
    };
    expect(providers[0].errors).toEqual(expected);
  });

  it('validateProviderName method should check provider name', () => {
    service.validateProviderName(providersErrorsMock[0]);
    service.validateProviderName(providersErrorsMock[1]);
    const expected = [{ providerNameEmpty: true }, { providerNameLength: true }];
    expect(providersErrorsMock[0].errors).toEqual(expected[0]);
    expect(providersErrorsMock[1].errors).toEqual(expected[1]);
  });

  it('validateOwnership method should check Ownership', () => {
    service.validateOwnership(providersErrorsMock[0]);
    const expected = { ownershipEmpty: true };
    expect(providersErrorsMock[0].errors).toEqual(expected);
  });

  it('validateIdentifier method should check Identifier', () => {
    const expected = [{ identifierEmpty: true }, { identifierDuplicate: true }, { identifierFormat: true }];
    service.validateIdentifier(providersErrorsMock[0], emailsEdrpous);
    service.validateIdentifier(providersErrorsMock[1], emailsEdrpous);
    service.validateIdentifier(providersErrorsMock[2], emailsEdrpous);
    expect(providersErrorsMock[0].errors).toEqual(expected[0]);
    expect(providersErrorsMock[1].errors).toEqual(expected[1]);
    expect(providersErrorsMock[2].errors).toEqual(expected[2]);
  });

  it('validateLicenseNumber method should check LicenseNumber', () => {
    const expected = { licenseNumberEmpty: true };
    service.validateLicenseNumber(providersErrorsMock[0]);
    expect(providersErrorsMock[0].errors).toEqual(expected);
  });

  it('validateSettlement method should check Settlement', () => {
    const expected = [{ settlementEmpty: true }, { settlementLength: true }, { settlementLanguage: true }];
    service.validateSettlement(providersErrorsMock[0]);
    service.validateSettlement(providersErrorsMock[1]);
    service.validateSettlement(providersErrorsMock[2]);
    expect(providersErrorsMock[0].errors).toEqual(expected[0]);
    expect(providersErrorsMock[1].errors).toEqual(expected[1]);
    expect(providersErrorsMock[2].errors).toEqual(expected[2]);
  });

  it('validateAddress method should check Address', () => {
    const expected = [{ addressEmpty: true }, { addressLanguage: true }];
    service.validateAddress(providersErrorsMock[0]);
    service.validateAddress(providersErrorsMock[1]);
    expect(providersErrorsMock[0].errors).toEqual(expected[0]);
    expect(providersErrorsMock[1].errors).toEqual(expected[1]);
  });

  it('validateEmail method should check Email', () => {
    const expected = [{ emailEmpty: true }, { emailFormat: true }, { emailDuplicate: true }];
    service.validateEmail(providersErrorsMock[0], emailsEdrpous);
    service.validateEmail(providersErrorsMock[1], emailsEdrpous);
    service.validateEmail(providersErrorsMock[2], emailsEdrpous);
    expect(providersErrorsMock[0].errors).toEqual(expected[0]);
    expect(providersErrorsMock[1].errors).toEqual(expected[1]);
    expect(providersErrorsMock[2].errors).toEqual(expected[2]);
  });

  it('validatePhoneNumber method should check PhoneNumber', () => {
    const expected = [{ phoneNumberEmpty: true }, { phoneNumberFormat: true }];
    service.validatePhoneNumber(providersErrorsMock[0]);
    service.validatePhoneNumber(providersErrorsMock[1]);
    expect(providersErrorsMock[0].errors).toEqual(expected[0]);
    expect(providersErrorsMock[1].errors).toEqual(expected[1]);
  });
});
