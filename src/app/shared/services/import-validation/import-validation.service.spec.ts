import { TestBed } from '@angular/core/testing';
import { ImportValidationService } from './import-validation.service';

describe('ImportValidationService', () => {
  let service: ImportValidationService<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should validate fields and mark errors through checkForInvalidData', () => {
    const items = [{ name: '', role: 'invalidRole', errors: {} }];
    const config = [
      {
        fieldName: 'name',
        validationParam: { checkEmpty: true, checkLength: false, checkLanguage: false, checkRNOKPP: false, checkAssignedRole: false }
      },
      {
        fieldName: 'role',
        validationParam: { checkAssignedRole: true, checkEmpty: false, checkLength: false, checkLanguage: false, checkRNOKPP: false }
      }
    ];

    service.checkForInvalidData(items, config);

    expect(items[0].errors).toEqual({
      nameEmpty: true,
      roleFormat: true
    });
  });

  it('should mark error when length is less than 2 and config.checkLength is true', () => {
    const items = [{ name: 'a', errors: {} }];
    const config = [
      {
        fieldName: 'name',
        validationParam: { checkLength: true, checkEmpty: false, checkLanguage: false, checkRNOKPP: false, checkAssignedRole: false }
      }
    ];

    service.checkForInvalidData(items, config);

    expect(items[0].errors).toEqual({ nameLength: true });
  });

  it('should mark error when length is more than 50 and config.checkLength is true', () => {
    const items = [{ name: 'a'.repeat(51), errors: {} }];
    const config = [
      {
        fieldName: 'name',
        validationParam: { checkLength: true, checkEmpty: false, checkLanguage: false, checkRNOKPP: false, checkAssignedRole: false }
      }
    ];

    service.checkForInvalidData(items, config);

    expect(items[0].errors).toEqual({ nameLength: true });
  });

  it('should mark error when language is not valid and config.checkLanguage is true', () => {
    const items = [{ name: 'abc123', errors: {} }];
    const config = [
      {
        fieldName: 'name',
        validationParam: { checkLanguage: true, checkLength: false, checkEmpty: false, checkRNOKPP: false, checkAssignedRole: false }
      }
    ];

    service.checkForInvalidData(items, config);

    expect(items[0].errors).toEqual({ nameLanguage: true });
  });

  it('should not mark an error for RNOKPP format when config.checkRNOKPP is true but not handled', () => {
    const items = [{ name: '123456789', errors: {} }];
    const config = [
      {
        fieldName: 'name',
        validationParam: {
          checkRNOKPP: true,
          checkLength: false,
          checkEmpty: false,
          checkLanguage: false,
          checkAssignedRole: false,
          checkDuplicate: false
        }
      }
    ];

    service.checkForInvalidData(items, config);

    expect(items[0].errors).toEqual({});
  });
  it('should mark error when assigned role is invalid and config.checkAssignedRole is true', () => {
    const items = [{ role: 'invalidRole', errors: {} }];
    const config = [
      {
        fieldName: 'role',
        validationParam: { checkAssignedRole: true, checkLength: false, checkEmpty: false, checkLanguage: false, checkRNOKPP: false }
      }
    ];

    service.checkForInvalidData(items, config);

    expect(items[0].errors).toEqual({ roleFormat: true });
  });
  it('should not mark an error for initials format when config.checkInitials is true and input is valid', () => {
    const validInitials = 'Олег'; // Example of valid initials
    const items = [{ name: validInitials, errors: {} }];
    const config = [
      {
        fieldName: 'name',
        validationParam: {
          checkRNOKPP: false,
          checkLength: false,
          checkEmpty: false,
          checkLanguage: false,
          checkAssignedRole: false,
          checkDuplicate: false,
          checkInitials: true
        }
      }
    ];

    service.checkForInvalidData(items, config);

    expect(items[0].errors).toEqual({}); // Ensure no errors are added
  });

  it('should mark an error for initials format when config.checkInitials is true and input is invalid', () => {
    const invalidInitials = 'Олег%'; // Example of invalid initials
    const items = [{ name: invalidInitials, errors: {} }];
    const config = [
      {
        fieldName: 'name',
        validationParam: {
          checkRNOKPP: false,
          checkLength: false,
          checkEmpty: false,
          checkLanguage: false,
          checkAssignedRole: false,
          checkDuplicate: false,
          checkInitials: true
        }
      }
    ];

    service.checkForInvalidData(items, config);

    expect(items[0].errors).toEqual({ nameFormat: true }); // Ensure the correct error is added
  });
});
