import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Subject, tap } from 'rxjs';

import { EventEmitter, SimpleChange } from '@angular/core';
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

    it('should validate TimeFormat in FormLevel', fakeAsync(() => {
      const control1 = new FormControl('');
      const formGroup = new FormGroup({ control1: control1 });
      component.validationFormControl = formGroup;
      component.formLevelValidation = true;

      component.ngOnInit();
      formGroup.setErrors({ invalidTimeRange: true });
      tick(200);

      expect(component.invalidTimeRange).toBeTruthy();
    }));
  });

  describe('checkValidationErrors method', () => {
    let errors: ValidationErrors;
    let control: FormControl;

    beforeEach(() => {
      control = component.validationFormControl as FormControl;
    });

    it('should assign to invalidEmail if email error is present', () => {
      errors = { email: true };

      (component as any).checkValidationErrors(errors);

      expect(component.invalidEmail).toEqual(errors.email);
    });

    it('should assign TRUE to invalidPhoneLength if isPhoneNumber and minlength error are present', () => {
      component.isPhoneNumber = true;
      errors = { minlength: true };

      (component as any).checkValidationErrors(errors);

      expect(component.invalidPhoneLength).toBeTruthy();
    });

    it('should assign TRUE to invalidPhoneLength if validationFormControl has minlength error and if isPhoneNumber', () => {
      component.isPhoneNumber = true;
      control.setErrors({ minlength: true });

      (component as any).checkValidationErrors(control.errors);

      expect(component.invalidPhoneLength).toBeTruthy();
    });

    it('should assign TRUE to invalidPhoneNumber if validationFormControl has validatePhoneNumber error and if isPhoneNumber', () => {
      component.isPhoneNumber = true;
      control.setErrors({ validatePhoneNumber: true, minlength: false });

      (component as any).checkValidationErrors(control.errors);

      expect(component.invalidPhoneNumber).toBeTruthy();
    });

    it('should assign TRUE to invalidEdrpouIpn if isEdrpouIpn and minlength error are present', () => {
      component.isEdrpouIpn = true;
      errors = { minlength: true };

      (component as any).checkValidationErrors(errors);

      expect(component.invalidEdrpouIpn).toBeTruthy();
    });

    it('should assign TRUE to invalidFieldLength if minlength/maxlength errors are present', () => {
      errors = { minlength: true, maxlength: true };

      (component as any).checkValidationErrors(errors);

      expect(component.invalidFieldLength).toBeTruthy();
    });

    it('should assign TRUE to invalidSearch if isSearchBar and errors are present', () => {
      component.isSearchBar = true;
      errors = { minlength: true, maxlength: true };

      (component as any).checkValidationErrors(errors);

      expect(component.invalidSearch).toBeTruthy();
    });
  });

  describe('checkInvalidText method', () => {
    let errors: ValidationErrors;

    it('should assign to invalidSymbols TRUE if required pattern is equal to NAME_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: NAME_REGEX } };

      (component as any).checkInvalidText(errors);

      expect(component.invalidSymbols).toBeTruthy();
      expect(component.invalidCharacters).toBeFalsy();
      expect(component.invalidStreet).toBeFalsy();
      expect(component.invalidHouse).toBeFalsy();
      expect(component.invalidSectionName).toBeFalsy();
    });

    it('should assign to invalidCharacters TRUE if required pattern is equal to NO_LATIN_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: NO_LATIN_REGEX } };

      (component as any).checkInvalidText(errors);

      expect(component.invalidSymbols).toBeFalsy();
      expect(component.invalidCharacters).toBeTruthy();
      expect(component.invalidStreet).toBeFalsy();
      expect(component.invalidHouse).toBeFalsy();
      expect(component.invalidSectionName).toBeFalsy();
    });

    it('should assign to invalidStreet TRUE if required pattern is equal to STREET_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: STREET_REGEX } };

      (component as any).checkInvalidText(errors);

      expect(component.invalidSymbols).toBeFalsy();
      expect(component.invalidCharacters).toBeFalsy();
      expect(component.invalidStreet).toBeTruthy();
      expect(component.invalidHouse).toBeFalsy();
      expect(component.invalidSectionName).toBeFalsy();
    });

    it('should assign to invalidHouse TRUE if required pattern is equal to HOUSE_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: HOUSE_REGEX } };

      (component as any).checkInvalidText(errors);

      expect(component.invalidSymbols).toBeFalsy();
      expect(component.invalidCharacters).toBeFalsy();
      expect(component.invalidStreet).toBeFalsy();
      expect(component.invalidHouse).toBeTruthy();
      expect(component.invalidSectionName).toBeFalsy();
    });

    it('should assign to invalidSectionName TRUE if required pattern is equal to SECTION_NAME_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: SECTION_NAME_REGEX } };

      (component as any).checkInvalidText(errors);

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
      control = component.validationFormControl as FormControl;
      formControlHasErrorSpy = jest.spyOn(control, 'hasError');
    });

    it('should assign TRUE to invalidDateFormat if validationFormControl has matDatepickerParse error', () => {
      control.setErrors({ matDatepickerParse: true });

      (component as any).checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(formControlHasErrorSpy).toBeCalledWith('matDatepickerParse');
      expect(component.invalidDateFormat).toBeTruthy();
    });

    it('should assign FALSE to invalidDateFormat if validationFormControl has NO matDatepickerParse error', () => {
      control.setErrors({ matDatepickerParse: false, matDatepickerMin: true });

      (component as any).checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(component.invalidDateFormat).toBeFalsy();
    });

    it('should assign TRUE to invalidDateRange if validationFormControl has matDatepickerMin error', () => {
      control.setErrors({ matDatepickerMin: true, matDatepickerMax: false });

      (component as any).checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(formControlHasErrorSpy).toBeCalledWith('matDatepickerMin');
      expect(component.invalidDateRange).toBeTruthy();
    });

    it('should assign TRUE to invalidDateRange if validationFormControl has matDatepickerMax error', () => {
      control.setErrors({ matDatepickerMin: false, matDatepickerMax: true });

      (component as any).checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(formControlHasErrorSpy).toBeCalledWith('matDatepickerMax');
      expect(component.invalidDateRange).toBeTruthy();
    });

    it('should assign FALSE to invalidDateRange if validationFormControl has NO matDatepickerMin or matDatepickerMax errors', () => {
      control.setErrors({ matDatepickerParse: false, matDatepickerMin: false });

      (component as any).checkMatDatePicker();

      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(component.invalidDateRange).toBeFalsy();
    });
  });
});
