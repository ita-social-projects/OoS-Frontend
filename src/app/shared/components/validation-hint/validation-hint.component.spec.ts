import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ValidationErrors } from '@angular/forms';
import { SimpleChanges } from '@angular/core';

import { ValidationHintComponent } from './validation-hint.component';
import { HOUSE_REGEX, NAME_REGEX, NO_LATIN_REGEX, SECTION_NAME_REGEX, STREET_REGEX } from 'shared/constants/regex-constants';

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

  // describe('#ngOnInit', () => {
  //   let control: FormControl;
  //   let errors: ValidationErrors;
  //   let delay: number;

  //   beforeEach(() => {
  //     control = component.validationFormControl;
  //     errors = component.validationFormControl.errors;
  //     delay = 420;
  //   });

  //   it('should mark validationFormControl as touched when status changes', fakeAsync(() => {
  //     const markAsTouchedSpy = jest.spyOn(component.validationFormControl, 'markAsTouched');
      
  //     component.ngOnInit();
  //     component.validationFormControl.setValue('test');
  //     tick(delay);
  
  //     expect(markAsTouchedSpy).toHaveBeenCalled();
  //   }));

  //   it('should execute checkMatDatePicker when validationFormControl status changes and minMaxDate is TRUE', fakeAsync(() => {
  //     component.minMaxDate = true;
  //     const checkMatDatePickerSpy = jest.spyOn(component, 'checkMatDatePicker' as any);

  //     component.ngOnInit();
  //     component.validationFormControl.setValue('test');
  //     tick(delay);

  //     expect(checkMatDatePickerSpy).toHaveBeenCalled();
  //   }));

  //   it('should NOT execute checkMatDatePicker when validationFormControl status changes and minMaxDate is FALSE', fakeAsync(() => {
  //     component.minMaxDate = false;
  //     const checkMatDatePickerSpy = jest.spyOn(component, 'checkMatDatePicker' as any);

  //     component.ngOnInit();
  //     component.validationFormControl.setValue('test');
  //     tick(delay);

  //     expect(checkMatDatePickerSpy).not.toHaveBeenCalled();
  //   }));

  //   it('should execute checkValidationErrors when validationFormControl status changes with errors', fakeAsync(() => {
  //     const checkValidationErrorsSpy = jest.spyOn(component, 'checkValidationErrors' as any);
  //     errors = { email: true };
      
  //     component.ngOnInit();
  //     component.validationFormControl.setValue('test');
  //     tick(delay);

  //     expect(checkValidationErrorsSpy).toHaveBeenCalledWith(errors);
  //   }));
  // });
  
  describe('checkValidationErrors method', () => {
    let errors: ValidationErrors;
    
    it('should assign to invalidEmail TRUE if errors have an email error', () => {
      errors = { email: true };

      component['checkValidationErrors'](errors);
      
      expect(component.invalidEmail).toBeTruthy();
    });
    
    it('should assign to invalidEmail FALSE if errors have NO an email error', () => {
      errors = { email: false };

      component['checkValidationErrors'](errors);
      
      expect(component.invalidEmail).toBeFalsy();
    });

    // invalidPhoneLength
    test.each`
      isPhoneNumber   | isMinlength   | isMaxlength   | expectedInvalidPhoneLength
      ${true}         | ${true}       | ${false}      | ${true}
      ${true}         | ${true}       | ${true}       | ${false}
      ${true}         | ${false}      | ${true}       | ${false}
      ${false}        | ${false}      | ${false}      | ${undefined}
    `('should assign to invalidPhoneLength $expectedInvalidPhoneLength when isPhoneNumber equal to $isPhoneNumber, minlength equal to $isMinlength and maxlength equal to $isMaxlength', 
      ({ isPhoneNumber, isMinlength, isMaxlength, expectedInvalidPhoneLength }) => {

        errors = { minlength: isMinlength, maxlength: isMaxlength };
        component.isPhoneNumber = isPhoneNumber;
  
        component['checkValidationErrors'](errors);
  
        expect(component.invalidPhoneLength).toBe(expectedInvalidPhoneLength);
      }); 
      
    // invalidEdrpouIpn
    test.each`
      isEdrpouIpn     | isMinlength   | isMaxlength   | expectedInvalidEdrpouIpn
      ${true}         | ${true}       | ${false}      | ${true}
      ${true}         | ${true}       | ${true}       | ${false}
      ${true}         | ${false}      | ${true}       | ${false}
      ${false}        | ${false}      | ${false}      | ${undefined}
    `('should assign to invalidEdrpouIpn $expectedInvalidEdrpouIpn when isEdrpouIpn equal to $isEdrpouIpn, minlength equal to $isMinlength and maxlength equal to $isMaxlength', 
      ({ isEdrpouIpn, isMinlength, isMaxlength, expectedInvalidEdrpouIpn }) => {

        errors = { minlength: isMinlength, maxlength: isMaxlength };
        component.isEdrpouIpn = isEdrpouIpn;

        component['checkValidationErrors'](errors);

        expect(component.invalidEdrpouIpn).toBe(expectedInvalidEdrpouIpn);
      });

    // invalidFieldLength
    test.each`
      isMinlength   | isMaxlength   | expectedInvalidFieldLength
      ${true}       | ${true}       | ${true}
      ${true}       | ${false}      | ${true}
      ${false}      | ${true}       | ${true}
      ${false}      | ${false}      | ${false}
    `('should assign to invalidFieldLength $expectedInvalidFieldLength when isPhoneNumber and isEdrpouIpn equal to false, minlength equal to $isMinlength, maxlength equal to $isMaxlength', 
      ({ isMinlength, isMaxlength, expectedInvalidFieldLength }) => {

        component.isPhoneNumber = false;
        component.isEdrpouIpn = false;
        errors = { minlength: isMinlength, maxlength: isMaxlength };

        component['checkValidationErrors'](errors);

        expect(component.invalidFieldLength).toBe(expectedInvalidFieldLength);
      });
  });

  describe('checkInvalidText method', () => {
    let errors: ValidationErrors;

    it('should assign to invalidSymbols TRUE if required pattern is equal to NAME_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: NAME_REGEX } };

      component['checkInvalidText'](errors);

      expect(component.invalidSymbols).toBeTruthy();
      expect(component.invalidCharacters).toBeFalsy();
      expect(component.invalidStreet).toBeFalsy();
      expect(component.invalidHouse).toBeFalsy();
      expect(component.invalidSectionName).toBeFalsy();
    });

    it('should assign to invalidCharacters TRUE if required pattern is equal to NO_LATIN_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: NO_LATIN_REGEX } };

      component['checkInvalidText'](errors);

      expect(component.invalidSymbols).toBeFalsy();
      expect(component.invalidCharacters).toBeTruthy();
      expect(component.invalidStreet).toBeFalsy();
      expect(component.invalidHouse).toBeFalsy();
      expect(component.invalidSectionName).toBeFalsy();
    });

    it('should assign to invalidStreet TRUE if required pattern is equal to STREET_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: STREET_REGEX } };

      component['checkInvalidText'](errors);

      expect(component.invalidSymbols).toBeFalsy();
      expect(component.invalidCharacters).toBeFalsy();
      expect(component.invalidStreet).toBeTruthy();
      expect(component.invalidHouse).toBeFalsy();
      expect(component.invalidSectionName).toBeFalsy();
    });

    it('should assign to invalidHouse TRUE if required pattern is equal to HOUSE_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: HOUSE_REGEX } };

      component['checkInvalidText'](errors);

      expect(component.invalidSymbols).toBeFalsy();
      expect(component.invalidCharacters).toBeFalsy();
      expect(component.invalidStreet).toBeFalsy();
      expect(component.invalidHouse).toBeTruthy();
      expect(component.invalidSectionName).toBeFalsy();
    });

    it('should assign to invalidSectionName TRUE if required pattern is equal to SECTION_NAME_REGEX and others should be FALSE', () => {
      errors = { pattern: { requiredPattern: SECTION_NAME_REGEX } };

      component['checkInvalidText'](errors);

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
  
      component['checkMatDatePicker']();
  
      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(formControlHasErrorSpy).toBeCalledWith('matDatepickerParse');
      expect(component.invalidDateFormat).toBeTruthy();
    });
  
    it('should assign FALSE to invalidDateFormat if validationFormControl has NO matDatepickerParse error', () => {
      control.setErrors({ matDatepickerParse: false, matDatepickerMin: true });
  
      component['checkMatDatePicker']();
  
      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(component.invalidDateFormat).toBeFalsy();
    });
  
    it('should assign TRUE to invalidDateRange if validationFormControl has matDatepickerMin error', () => {
      control.setErrors({ matDatepickerMin: true, matDatepickerMax: false });
  
      component['checkMatDatePicker']();
  
      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(formControlHasErrorSpy).toBeCalledWith('matDatepickerMin');
      expect(component.invalidDateRange).toBeTruthy();
    });

    it('should assign TRUE to invalidDateRange if validationFormControl has matDatepickerMax error', () => {
      control.setErrors({ matDatepickerMin: false, matDatepickerMax: true });
  
      component['checkMatDatePicker']();
  
      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(formControlHasErrorSpy).toBeCalledWith('matDatepickerMax');
      expect(component.invalidDateRange).toBeTruthy();
    });
  
    it('should assign FALSE to invalidDateRange if validationFormControl has NO matDatepickerMin or matDatepickerMax errors', () => {
      control.setErrors({ matDatepickerParse: false, matDatepickerMin: false });
  
      component['checkMatDatePicker']();
  
      expect(formControlHasErrorSpy).toHaveBeenCalled();
      expect(component.invalidDateRange).toBeFalsy();
    });
  });
});
