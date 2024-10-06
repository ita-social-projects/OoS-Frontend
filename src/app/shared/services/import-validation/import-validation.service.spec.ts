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

  describe('checkForInvalidData method', () => {
    it('should set errors for empty fields', () => {
      const items = [
        { name: '', age: 30 },
        { name: 'John', age: 25 }
      ];
      const config: FieldsConfig[] = [
        { fieldName: 'name', validationParam: { checkEmpty: true, checkLength: false } },
        { fieldName: 'age', validationParam: { checkEmpty: false, checkLength: false } }
      ];

      service.checkForInvalidData(items, config);

      expect(items[0].errors).toEqual({ nameEmpty: true });
      expect(items[1].errors).toEqual({});
    });

    it('should set errors for fields with invalid length', () => {
      const items = [
        { name: 'A', age: '25' },
        { name: 'John Doe', age: '30' }
      ];
      const config: FieldsConfig[] = [{ fieldName: 'name', validationParam: { checkLength: true } }];

      service.checkForInvalidData(items, config);

      expect(items[0].errors).toEqual({ nameLength: true });
      expect(items[1].errors).toEqual({});
    });

    it('should set errors for non-Latin characters', () => {
      const items = [
        { name: 'Иван', age: 30 },
        { name: 'John', age: 25 }
      ];
      const config: FieldsConfig[] = [{ fieldName: 'name', validationParam: { checkLanguage: true } }];

      service.checkForInvalidData(items, config);

      expect(items[0].errors).toEqual({ nameLanguage: true });
      expect(items[1].errors).toEqual({});
    });

    it('should set errors for invalid RNOKPP format', () => {
      const items = [
        { rnokpp: '123456', age: 30 },
        { rnokpp: 'INVALID', age: 25 }
      ];
      const config: FieldsConfig[] = [{ fieldName: 'rnokpp', validationParam: { checkRNOKPP: true } }];

      service.checkForInvalidData(items, config);

      expect(items[0].errors).toEqual({});
      expect(items[1].errors).toEqual({ rnokppFormat: true });
    });

    it('should set errors for invalid assigned roles', () => {
      const items = [
        { role: 'manager', age: 30 },
        { role: 'employee', age: 25 }
      ];
      const config: FieldsConfig[] = [{ fieldName: 'role', validationParam: { checkAssignedRole: true } }];

      service.checkForInvalidData(items, config);

      expect(items[0].errors).toEqual({ roleFormat: true });
      expect(items[1].errors).toEqual({});
    });
  });
});
