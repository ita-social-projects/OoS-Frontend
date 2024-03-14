import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ValidationErrors } from '@angular/forms';

import { tap } from 'rxjs';
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

  describe('ngOnInit method', () => {
    it('should mark validationFormControl as touched if not already touched', fakeAsync(() => {
      component.validationFormControl.statusChanges.pipe(tap(() => tick(200))).subscribe(() => {
        expect(component.validationFormControl.markAsTouched).toHaveBeenCalled();
      });
      jest.spyOn(component.validationFormControl, 'markAsTouched');

      component.ngOnInit();

      component.validationFormControl.setValue('test');
    }));

    it('should not mark validationFormControl as touched if already touched', fakeAsync(() => {
      component.validationFormControl.markAsTouched();
      component.validationFormControl.statusChanges.pipe(tap(() => tick(200))).subscribe(() => {
        expect(component.validationFormControl.markAsTouched).not.toHaveBeenCalled();
      });
      jest.spyOn(component.validationFormControl, 'markAsTouched');

      component.ngOnInit();

      component.validationFormControl.setValue('test');
    }));
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
      control = component.validationFormControl;
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
