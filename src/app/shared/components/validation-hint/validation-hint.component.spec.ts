import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

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
  
  describe('tests of checkInvalidText method', () => {
    const errorsCasesMap = [
      ['invalidSymbols', 'NAME_REGEX', NAME_REGEX, true, false, false, false, false],
      ['invalidCharacters', 'NO_LATIN_REGEX', NO_LATIN_REGEX, false, true, false, false, false],
      ['invalidStreet', 'STREET_REGEX', STREET_REGEX, false, false, true, false, false],
      ['invalidHouse', 'HOUSE_REGEX', HOUSE_REGEX, false, false, false, true, false],
      ['invalidSectionName', 'SECTION_NAME_REGEX', SECTION_NAME_REGEX, false, false, false, false, true],
    ];

    test.each(errorsCasesMap)('should assign to %s TRUE if required pattern equal to %s',
      (_, __, requiredPattern, invalidSymbols, invalidCharacters, invalidStreet, invalidHouse, invalidSectionName) => {
        const errors = { pattern: { requiredPattern } };
        component['checkInvalidText'](errors);

        expect(component.invalidSymbols).toBe(invalidSymbols);
        expect(component.invalidCharacters).toBe(invalidCharacters);
        expect(component.invalidStreet).toBe(invalidStreet);
        expect(component.invalidHouse).toBe(invalidHouse);
        expect(component.invalidSectionName).toBe(invalidSectionName);
      });
  });

  describe('tests of checkMatDatePicker method', () => {
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
