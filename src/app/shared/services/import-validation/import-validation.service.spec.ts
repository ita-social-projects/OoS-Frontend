import { TestBed } from '@angular/core/testing';
import { FieldsConfig } from 'shared/models/admin-import-export.model';
import { ImportValidationService } from './import-validation.service';

describe('ImportValidationService', () => {
  let service: ImportValidationService;

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

  it('should mark error when RNOKPP format is invalid and config.checkRNOKPP is true', () => {
    const items = [{ name: 'invalidRNOKPP', errors: {} }];
    const config = [
      {
        fieldName: 'name',
        validationParam: { checkRNOKPP: true, checkLength: false, checkEmpty: false, checkLanguage: false, checkAssignedRole: false }
      }
    ];

    service.checkForInvalidData(items, config);

    expect(items[0].errors).toEqual({ nameFormat: true });
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
});
