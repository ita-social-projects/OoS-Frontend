import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ValidationErrors } from '@angular/forms';

import { HOUSE_REGEX, NAME_REGEX, NO_LATIN_REGEX, SECTION_NAME_REGEX, STREET_REGEX } from 'shared/constants/regex-constants';
import { ValidationHintComponent } from './validation-hint.component';

describe('ValidationHintComponent', () => {
  let component: ValidationHintComponent;
  let fixture: ComponentFixture<ValidationHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidationHintComponent]
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

  describe('checkValidationErrors method', () => {
    let control: FormControl;

    beforeEach(() => {
      control = component.validationFormControl;
    });

    it('should assign TRUE to invalidPhoneLength if validationFormControl has minlength error and if isPhoneNumber', () => {
      component.isPhoneNumber = true;
      control.setErrors({ minlength: true });

      component.checkValidationErrors(control.errors);

      expect(component.invalidPhoneLength).toBeTruthy();
    });

    it('should assign TRUE to invalidPhoneNumber if validationFormControl has validatePhoneNumber error and if isPhoneNumber', () => {
      component.isPhoneNumber = true;
      control.setErrors({ validatePhoneNumber: true, minlength: false });

      component.checkValidationErrors(control.errors);

      expect(component.invalidPhoneNumber).toBeTruthy();
    });
  });

  describe('checkInvalidText method', () => {
    let errors: ValidationErrors;

    it('should assign to invalidSymbols TRUE if required pattern is equal to NAME_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: NAME_REGEX } };

      component.checkInvalidText(errors);

      expect(component.invalidSymbols).toBeTruthy();
      expect(component.invalidCharacters).toBeFalsy();
      expect(component.invalidStreet).toBeFalsy();
      expect(component.invalidHouse).toBeFalsy();
      expect(component.invalidSectionName).toBeFalsy();
    });

    it('should assign to invalidCharacters TRUE if required pattern is equal to NO_LATIN_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: NO_LATIN_REGEX } };

      component.checkInvalidText(errors);

      expect(component.invalidSymbols).toBeFalsy();
      expect(component.invalidCharacters).toBeTruthy();
      expect(component.invalidStreet).toBeFalsy();
      expect(component.invalidHouse).toBeFalsy();
      expect(component.invalidSectionName).toBeFalsy();
    });

    it('should assign to invalidStreet TRUE if required pattern is equal to STREET_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: STREET_REGEX } };

      component.checkInvalidText(errors);

      expect(component.invalidSymbols).toBeFalsy();
      expect(component.invalidCharacters).toBeFalsy();
      expect(component.invalidStreet).toBeTruthy();
      expect(component.invalidHouse).toBeFalsy();
      expect(component.invalidSectionName).toBeFalsy();
    });

    it('should assign to invalidHouse TRUE if required pattern is equal to HOUSE_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: HOUSE_REGEX } };

      component.checkInvalidText(errors);

      expect(component.invalidSymbols).toBeFalsy();
      expect(component.invalidCharacters).toBeFalsy();
      expect(component.invalidStreet).toBeFalsy();
      expect(component.invalidHouse).toBeTruthy();
      expect(component.invalidSectionName).toBeFalsy();
    });

    it('should assign to invalidSectionName TRUE if required pattern is equal to SECTION_NAME_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: SECTION_NAME_REGEX } };

      component.checkInvalidText(errors);

      expect(component.invalidSymbols).toBeFalsy();
      expect(component.invalidCharacters).toBeFalsy();
      expect(component.invalidStreet).toBeFalsy();
      expect(component.invalidHouse).toBeFalsy();
      expect(component.invalidSectionName).toBeTruthy();
    });
  });

  describe('checkMatDatePicker method', () => {
    let control: FormControl;
    let formControlHasErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      control = component.validationFormControl;
      formControlHasErrorSpy = jest.spyOn(control, 'hasError');
    });

    it('should assign TRUE to invalidDateFormat if validationFormControl has matDatepickerParse error', () => {
      control.setErrors({ matDatepickerParse: true });

      component.checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(formControlHasErrorSpy).toBeCalledWith('matDatepickerParse');
      expect(component.invalidDateFormat).toBeTruthy();
    });

    it('should assign FALSE to invalidDateFormat if validationFormControl has NO matDatepickerParse error', () => {
      control.setErrors({ matDatepickerParse: false, matDatepickerMin: true });

      component.checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(component.invalidDateFormat).toBeFalsy();
    });

    it('should assign TRUE to invalidDateRange if validationFormControl has matDatepickerMin error', () => {
      control.setErrors({ matDatepickerMin: true, matDatepickerMax: false });

      component.checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(formControlHasErrorSpy).toBeCalledWith('matDatepickerMin');
      expect(component.invalidDateRange).toBeTruthy();
    });

    it('should assign TRUE to invalidDateRange if validationFormControl has matDatepickerMax error', () => {
      control.setErrors({ matDatepickerMin: false, matDatepickerMax: true });

      component.checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(formControlHasErrorSpy).toBeCalledWith('matDatepickerMax');
      expect(component.invalidDateRange).toBeTruthy();
    });

    it('should assign FALSE to invalidDateRange if validationFormControl has NO matDatepickerMin or matDatepickerMax errors', () => {
      control.setErrors({ matDatepickerParse: false, matDatepickerMin: false });

      component.checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(component.invalidDateRange).toBeFalsy();
    });
  });
});
