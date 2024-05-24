import { TestBed } from '@angular/core/testing';

import { IProvidersID } from 'shared/models/admin-import-export.model';
import { ImportValidationService } from './import-validation.service';

describe('ImportValidationService', () => {
  const emailsEdrpous = {
    edrpous: [2],
    emails: [1]
  };
  const providersCorrect = [
    {
      providerName: 'Клуб спортивного бального танцю',
      ownership: 'Державна',
      identifier: 45679876,
      licenseNumber: 'не вказано',
      settlement: 'Луцьк',
      address: 'Шевченка 2',
      email: 'some@gmail.com',
      phoneNumber: 660666066,
      errors: {},
      id: 0
    }
  ];
  const providersErrors: IProvidersID[] = [
    {
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
      providerName: 'К',
      ownership: 'Державна',
      identifier: 12345678,
      licenseNumber: 123445,
      settlement: 'Л',
      address: 'Shevchenka',
      email: 'somegmail.com',
      phoneNumber: 660666,
      id: 2,
      errors: {}
    },
    {
      providerName: 'К',
      ownership: 'Державна',
      identifier: 12345,
      licenseNumber: 123445,
      settlement: 'lutsk',
      address: 'Шевченка 2',
      email: 'some@gmail.com',
      phoneNumber: 660666066,
      id: 2,
      errors: {}
    }
  ];
  let service: ImportValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should correctly process the providers and update errors', () => {
    const providers: IProvidersID[] = [
      {
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
  it('should check provider name', () => {
    service.checkProviderName(providersErrors[0]);
    service.checkProviderName(providersErrors[1]);
    const expected = [{ providerNameEmpty: true }, { providerNameLength: true }];
    expect(providersErrors[0].errors).toEqual(expected[0]);
    expect(providersErrors[1].errors).toEqual(expected[1]);
    providersErrors.forEach((e) => (e.errors = {}));
  });
  it('should check Ownership', () => {
    service.checkOwnership(providersErrors[0]);
    const expected = { ownershipEmpty: true };
    expect(providersErrors[0].errors).toEqual(expected);
    providersErrors.forEach((e) => (e.errors = {}));
  });
  it('should check Identifier', () => {
    const expected = [{ identifierEmpty: true }, { identifierDuplicate: true }, { identifierFormat: true }];
    service.checkIdentifier(providersErrors[0], emailsEdrpous);
    service.checkIdentifier(providersErrors[1], emailsEdrpous);
    service.checkIdentifier(providersErrors[2], emailsEdrpous);

    expect(providersErrors[0].errors).toEqual(expected[0]);
    expect(providersErrors[1].errors).toEqual(expected[1]);
    expect(providersErrors[2].errors).toEqual(expected[2]);
    providersErrors.forEach((e) => (e.errors = {}));
  });
  it('should check LicenseNumber', () => {
    const expected = { licenseNumberEmpty: true };
    service.checkLicenseNumber(providersErrors[0]);
    expect(providersErrors[0].errors).toEqual(expected);
    providersErrors.forEach((e) => (e.errors = {}));
  });
});
