import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, tap } from 'rxjs';
import { EventEmitter, SimpleChange } from '@angular/core';
import { HOUSE_REGEX, NAME_REGEX, NO_LATIN_REGEX, SECTION_NAME_REGEX, STREET_REGEX } from 'shared/constants/regex-constants';
import { ValidationMessages } from 'shared/enum/validation-messages';
import { ValidationHintComponent } from './validation-hint.component';

describe('ValidationHintComponent', () => {
  let component: ValidationHintComponent;
  let fixture: ComponentFixture<ValidationHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ValidationHintComponent],
      providers: [TranslateService]
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

    it('should validate TimeRange in FormLevel', fakeAsync(() => {
      const control1 = new FormControl('');
      const formGroup = new FormGroup({ control1: control1 });
      component.validationFormControl = formGroup;
      component.formLevelValidation = true;

      component.ngOnInit();
      formGroup.setErrors({ invalidTimeRange: true });
      tick(200);

      expect(component.errors).toContain(ValidationMessages.INVALID_TIME_RANGE);
    }));
  });

  describe('checkValidationErrors method', () => {
    let errors: ValidationErrors;
    let control: FormControl;

    beforeEach(() => {
      control = component.validationFormControl as FormControl;
    });

    it('should add InvalidEmail if email error is present', () => {
      errors = { email: true };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).toContain(ValidationMessages.INVALID_EMAIL);
    });

    it('should add INVALID_PHONE_LENGTH if isPhoneNumber=true and minlength error is present', () => {
      component.isPhoneNumber = true;
      errors = { minlength: true };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).toContain(ValidationMessages.INVALID_PHONE_LENGTH);
    });

    it('should add INVALID_PHONE_LENGTH if validationFormControl has minlength error and isPhoneNumber=true', () => {
      component.isPhoneNumber = true;
      control.setErrors({ minlength: true });

      (component as any).checkValidationErrors(control.errors);

      expect(component.errors).toContain(ValidationMessages.INVALID_PHONE_LENGTH);
    });

    it('should add INVALID_PHONE_NUMBER if validatePhoneNumber error exists and isPhoneNumber=true', () => {
      component.isPhoneNumber = true;
      control.setErrors({ validatePhoneNumber: true, minlength: false });

      (component as any).checkValidationErrors(control.errors);

      expect(component.errors).toContain(ValidationMessages.INVALID_PHONE_NUMBER);
    });

    it('should add INVALID_EDRPO_IPN if isEdrpouIpn=true and minlength error is present', () => {
      component.isEdrpouIpn = true;
      errors = { minlength: true };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).toContain(ValidationMessages.INVALID_EDRPO_IPN);
    });

    it('should add INVALID_LENGTH_NO_MORE_THAN (generic field length error) if minlength/maxlength errors are present', () => {
      errors = { minlength: true, maxlength: true };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).toContain(ValidationMessages.INVALID_LENGTH_NO_MORE_THAN);
    });

    it('should add INVALID_SEARCH if invalidSearch error is present', () => {
      errors = { invalidSearch: true };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).toContain(ValidationMessages.INVALID_SEARCH);
    });
  });

  describe('checkInvalidText method', () => {
    let errors: ValidationErrors;

    it('should push INVALID_SYMBOLS if requiredPattern = NAME_REGEX', () => {
      errors = { pattern: { requiredPattern: NAME_REGEX } };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).toContain(ValidationMessages.INVALID_SYMBOLS);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_CHARACTERS);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_STREET);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_HOUSE);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_SECTION_NAME);
    });

    it('should add INVALID_CHARACTERS if requiredPattern = NO_LATIN_REGEX', () => {
      errors = { pattern: { requiredPattern: NO_LATIN_REGEX } };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).not.toContain(ValidationMessages.INVALID_SYMBOLS);
      expect(component.errors).toContain(ValidationMessages.INVALID_CHARACTERS);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_STREET);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_HOUSE);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_SECTION_NAME);
    });

    it('should push INVALID_STREET if requiredPattern = STREET_REGEX', () => {
      errors = { pattern: { requiredPattern: STREET_REGEX } };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).not.toContain(ValidationMessages.INVALID_SYMBOLS);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_CHARACTERS);
      expect(component.errors).toContain(ValidationMessages.INVALID_STREET);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_HOUSE);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_SECTION_NAME);
    });

    it('should push INVALID_HOUSE if requiredPattern = HOUSE_REGEX', () => {
      errors = { pattern: { requiredPattern: HOUSE_REGEX } };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).not.toContain(ValidationMessages.INVALID_SYMBOLS);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_CHARACTERS);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_STREET);
      expect(component.errors).toContain(ValidationMessages.INVALID_HOUSE);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_SECTION_NAME);
    });

    it('should add INVALID_SECTION_NAME if requiredPattern = SECTION_NAME_REGEX', () => {
      errors = { pattern: { requiredPattern: SECTION_NAME_REGEX } };

      (component as any).checkValidationErrors(errors);

      expect(component.errors).not.toContain(ValidationMessages.INVALID_SYMBOLS);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_CHARACTERS);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_STREET);
      expect(component.errors).not.toContain(ValidationMessages.INVALID_HOUSE);
      expect(component.errors).toContain(ValidationMessages.INVALID_SECTION_NAME);
    });
  });

  describe('checkMatDatePicker method', () => {
    let control: FormControl;
    let formControlHasErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      control = component.validationFormControl as FormControl;
    });

    it('should add INVALID_DATE_FIELD if matDatepickerParse error exists', () => {
      control.setErrors({ matDatepickerParse: true });
      component.errors = [ValidationMessages.REQUIRED_INPUT];

      (component as any).checkValidationErrors(control.errors);

      expect(component.errors).toContain(ValidationMessages.INVALID_DATE_FIELD);
    });

    it('should NOT add INVALID_DATE_FIELD if matDatepickerParse error is absent', () => {
      control.setErrors({ matDatepickerParse: false, matDatepickerMin: true });

      (component as any).checkValidationErrors(control.errors);

      expect(component.errors).not.toContain(ValidationMessages.INVALID_DATE_FIELD);
    });

    it('should add INVALID_DATE_RANGE if matDatepickerMin error is true', () => {
      control.setErrors({ matDatepickerMin: true, matDatepickerMax: false });

      (component as any).checkValidationErrors(control.errors);

      expect(component.errors).toContain(ValidationMessages.INVALID_DATE_RANGE);
    });

    it('should add INVALID_DATE_RANGE if matDatepickerMax error is true', () => {
      control.setErrors({ matDatepickerMin: false, matDatepickerMax: true });

      (component as any).checkValidationErrors(control.errors);

      expect(component.errors).toContain(ValidationMessages.INVALID_DATE_RANGE);
    });

    it('should NOT add INVALID_DATE_RANGE if neither matDatepickerMin nor matDatepickerMax errors exist', () => {
      control.setErrors({ matDatepickerParse: false, matDatepickerMin: false });

      (component as any).checkValidationErrors(control.errors);

      expect(component.errors).not.toContain(ValidationMessages.INVALID_DATE_RANGE);
    });
  });
});
