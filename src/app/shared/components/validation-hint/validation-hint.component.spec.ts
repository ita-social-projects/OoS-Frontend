import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Subject, tap } from 'rxjs';
import { ValidationErrorsEnum } from 'shared/enum/validation-errors';
import { EventEmitter, SimpleChange } from '@angular/core';
import { HOUSE_REGEX, NAME_REGEX, NO_LATIN_REGEX, SECTION_NAME_REGEX, STREET_REGEX } from 'shared/constants/regex-constants';
import { ValidationMessageService } from 'shared/services/validation-message/validation-message.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationHintComponent } from './validation-hint.component';

describe('ValidationHintComponent', () => {
  let component: ValidationHintComponent;
  let fixture: ComponentFixture<ValidationHintComponent>;
  class MockTranslateService {
    get(key: string): string {
      return key;
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidationHintComponent],
      providers: [ValidationMessageService, { provide: TranslateService, useClass: MockTranslateService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationHintComponent);
    component = fixture.componentInstance;
    component.validationFormControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit validationFormControl.statusChanges on ngOnChanges if touched', () => {
    component.validationFormControl.markAsTouched();
    const spy = jest.spyOn(component.validationFormControl.statusChanges as EventEmitter<any>, 'emit');

    component.ngOnChanges({ isTouched: { currentValue: true } as SimpleChange });

    expect(spy).toHaveBeenCalled();
  });

  describe('ngOnInit method', () => {
    it('should mark validationFormControl as touched if not already touched', fakeAsync(() => {
      component.validationFormControl.statusChanges.pipe(tap(() => tick(200))).subscribe(() => {
        expect(component.validationFormControl.markAsTouched).toHaveBeenCalled();
      });
      jest.spyOn(component.validationFormControl, 'markAsTouched');

      component.ngOnInit();

      component.validationFormControl.setValue('test');
      tick(200);
    }));

    it('should call updateValidationState for each control in FormGroup', () => {
      const mockStatusChanges = new Subject<void>();
      const control1 = new FormControl('');
      const control2 = new FormControl('');
      const formGroup = new FormGroup({
        control1: control1,
        control2: control2
      });

      jest.spyOn(formGroup.statusChanges, 'pipe').mockReturnValue(mockStatusChanges.asObservable());
      jest.spyOn(component, 'updateValidationState');

      component.validationFormControl = formGroup;

      component.ngOnInit();

      mockStatusChanges.next();

      expect(component.updateValidationState).toHaveBeenCalledWith(control1);
      expect(component.updateValidationState).toHaveBeenCalledWith(control2);
    });

    it('should not mark validationFormControl as touched if already touched', fakeAsync(() => {
      component.validationFormControl.markAsTouched();
      component.validationFormControl.statusChanges.pipe(tap(() => tick(200))).subscribe(() => {
        expect(component.validationFormControl.markAsTouched).not.toHaveBeenCalled();
      });
      jest.spyOn(component.validationFormControl, 'markAsTouched');

      component.ngOnInit();

      component.validationFormControl.setValue('test');
      tick(200);
    }));

    it('should call checkMatDatePicker method if minMaxDate is present', fakeAsync(() => {
      component.minMaxDate = true;
      component.validationFormControl.statusChanges.pipe(tap(() => tick(200))).subscribe(() => {
        expect((component as any).checkMatDatePicker).toHaveBeenCalled();
      });
      jest.spyOn(component as any, 'checkMatDatePicker');

      component.ngOnInit();

      component.validationFormControl.setValue('test');
      tick(200);
    }));

    it('should validate TimeRange in FormLevel', fakeAsync(() => {
      const control1 = new FormControl('');
      const formGroup = new FormGroup({ control1: control1 });
      component.validationFormControl = formGroup;
      component.formLevelValidation = true;

      component.ngOnInit();
      formGroup.setErrors({ invalidTimeRange: true });
      tick(200);

      expect(component.errors).toContain(ValidationErrorsEnum.InvalidTimeRange);
    }));
  });

  describe('checkValidationErrors method', () => {
    let errors: ValidationErrors;
    let control: FormControl;

    beforeEach(() => {
      control = component.validationFormControl as FormControl;
    });

    it('should add InvalidEmail to errors array if email error is present', () => {
      errors = { email: true };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).toContain(ValidationErrorsEnum.InvalidEmail);
    });

    it('should add InvalidPhoneLength to errors array if isPhoneNumber is true and minlength error is present', () => {
      component.isPhoneNumber = true;
      errors = { minlength: true };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).toContain(ValidationErrorsEnum.InvalidPhoneLength);
    });

    it('should add InvalidPhoneLength to errors array if validationFormControl has minlength error and isPhoneNumber is true', () => {
      component.isPhoneNumber = true;
      control.setErrors({ minlength: true });

      (component as any).checkValidationErrors(control.errors);

      expect(component.errors).toContain(ValidationErrorsEnum.InvalidPhoneLength);
    });

    it('should add InvalidPhoneNumber to errors array if FormControl has validatePhoneNumber error and isPhoneNumber is true', () => {
      component.isPhoneNumber = true;
      control.setErrors({ validatePhoneNumber: true, minlength: false });

      (component as any).checkValidationErrors(control.errors);

      expect(component.errors).toContain(ValidationErrorsEnum.InvalidPhoneNumber);
    });

    it('should add InvalidEdrpouIpn to errors array if isEdrpouIpn is true and minlength error is present', () => {
      component.isEdrpouIpn = true;
      errors = { minlength: true };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).toContain(ValidationErrorsEnum.InvalidEdrpouIpn);
    });

    it('should add InvalidFieldLength to errors array if minlength/maxlength errors are present', () => {
      errors = { minlength: true, maxlength: true };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).toContain(ValidationErrorsEnum.InvalidFieldLength);
    });

    it('should add InvalidSearch to errors array if invalidSearch error is present', () => {
      errors = { invalidSearch: true };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).toContain(ValidationErrorsEnum.InvalidSearch);
    });
  });
  describe('checkInvalidText method', () => {
    let errors: ValidationErrors;

    it('should push invalidSymbols to error array if required pattern is equal to NAME_REGEX and others should not be in errors', () => {
      errors = { pattern: { requiredPattern: NAME_REGEX } };

      (component as any).checkInvalidText(errors);

      expect(component.errors).toContain(ValidationErrorsEnum.InvalidSymbols);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidCharacters);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidStreet);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidHouse);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidSectionName);
    });

    it('should add invalidCharacters to errors if required pattern is equal to NO_LATIN_REGEX and others should not be in errors', () => {
      errors = { pattern: { requiredPattern: NO_LATIN_REGEX } };

      (component as any).checkInvalidText(errors);

      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidSymbols);
      expect(component.errors).toContain(ValidationErrorsEnum.InvalidCharacters);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidStreet);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidHouse);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidSectionName);
    });

    it('should push invalidStreet to error array if required pattern is equal to STREET_REGEX and others should not be in errors', () => {
      errors = { pattern: { requiredPattern: STREET_REGEX } };

      (component as any).checkInvalidText(errors);

      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidSymbols);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidCharacters);
      expect(component.errors).toContain(ValidationErrorsEnum.InvalidStreet);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidHouse);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidSectionName);
    });

    it('should push invalidHouse to error array if required pattern is equal to HOUSE_REGEX and others should not be in errors', () => {
      errors = { pattern: { requiredPattern: HOUSE_REGEX } };

      (component as any).checkInvalidText(errors);

      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidSymbols);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidCharacters);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidStreet);
      expect(component.errors).toContain(ValidationErrorsEnum.InvalidHouse);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidSectionName);
    });

    it('should add invalidSectionName to errors if required pattern equals to SECTION_NAME_REGEX and others should not be in error', () => {
      errors = { pattern: { requiredPattern: SECTION_NAME_REGEX } };

      (component as any).checkInvalidText(errors);

      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidSymbols);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidCharacters);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidStreet);
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidHouse);
      expect(component.errors).toContain(ValidationErrorsEnum.InvalidSectionName);
    });
  });

  describe('checkMatDatePicker method', () => {
    let control: FormControl;
    let formControlHasErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      control = component.validationFormControl as FormControl;
      formControlHasErrorSpy = jest.spyOn(control, 'hasError');
    });

    it('should assign TRUE to invalidDateFormat if validationFormControl has matDatepickerParse error', () => {
      control.setErrors({ matDatepickerParse: true });
      component.errors = ['required'];

      (component as any).checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(formControlHasErrorSpy).toHaveBeenCalledWith('matDatepickerParse');
      expect(component.errors).toContain(ValidationErrorsEnum.IncorrectDateField);
    });

    it('should not contain invalidDateFormat if validationFormControl has NO matDatepickerParse error', () => {
      control.setErrors({ matDatepickerParse: false, matDatepickerMin: true });

      (component as any).checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(component.errors).not.toContain(ValidationErrorsEnum.IncorrectDateField);
    });

    it('should add invalidDateRange error if validationFormControl has matDatepickerMin error', () => {
      control.setErrors({ matDatepickerMin: true, matDatepickerMax: false });

      (component as any).checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(formControlHasErrorSpy).toHaveBeenCalledWith('matDatepickerMin');
      expect(component.errors).toContain(ValidationErrorsEnum.InvalidDateRange);
    });

    it('should add invalidDateRange error if validationFormControl has matDatepickerMax error', () => {
      control.setErrors({ matDatepickerMin: false, matDatepickerMax: true });

      (component as any).checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(formControlHasErrorSpy).toHaveBeenCalledWith('matDatepickerMax');
      expect(component.errors).toContain(ValidationErrorsEnum.InvalidDateRange);
    });

    it('should not contain invalidDateRange if validationFormControl has NO matDatepickerMin or matDatepickerMax errors', () => {
      control.setErrors({ matDatepickerParse: false, matDatepickerMin: false });

      (component as any).checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(component.errors).not.toContain(ValidationErrorsEnum.InvalidDateRange);
    });
  });
});
