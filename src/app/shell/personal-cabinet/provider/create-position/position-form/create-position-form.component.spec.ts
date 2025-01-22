import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Position } from 'shared/models/position.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxsModule } from '@ngxs/store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ValidationHintComponent } from 'shared/components/validation-hint/validation-hint.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreatePositionFormComponent } from './create-position-form.component';

jest.mock('shared/store/registration.state', () => ({
  RegistrationState: {
    provider: jest.fn()
  }
}));
describe('CreatePositionFormComponent', () => {
  let component: CreatePositionFormComponent;
  let fixture: ComponentFixture<CreatePositionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePositionFormComponent, ValidationHintComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        NgxsModule.forRoot(),
        MatCheckboxModule,
        MatRadioModule,
        BrowserAnimationsModule
      ],
      providers: [FormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePositionFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the form and emit it', () => {
      const emitSpy = jest.spyOn(component.passPositionFormGroup, 'emit');

      component.ngOnInit();

      expect(component.PositionFormGroup).toBeDefined();
      expect(emitSpy).toHaveBeenCalledWith(component.PositionFormGroup);
    });

    it('should activate edit mode if position exists', () => {
      const position: Position = {
        language: 'en',
        description: 'Test description',
        department: 'Test department',
        seatsAmount: 10,
        fullName: 'Full Name',
        shortName: 'Short Name',
        genitiveName: 'Genitive Name',
        isTeachingPosition: true,
        rate: 100,
        tariff: 200,
        classifierType: 'Test type',
        isForRuralAres: false,
        providerId: '123'
      } as Position;
      component.position = position;
      const activateEditModeSpy = jest.spyOn(component as any, 'activateEditMode');

      component.ngOnInit();

      expect(activateEditModeSpy).toHaveBeenCalled();
    });
  });

  describe('activateEditMode', () => {
    it('should patch form values and configure seatsAmountControl', () => {
      const position: Position = { seatsAmount: 1 } as Position;
      component.position = position;
      expect(component.PositionFormGroup.get('seatsAmountRadioBtnControl').value).toEqual(true);

      component.ngOnInit();

      expect(component.PositionFormGroup.get('seatsAmountRadioBtnControl').value).toEqual(false);
    });
  });

  describe('availableSeatsControlListener', () => {
    it('should update seatsAmountControl on value change', () => {
      const markFormAsDirtySpy = jest.spyOn(component, 'markFormAsDirtyOnUserInteraction');
      component.ngOnInit();

      component.PositionFormGroup.get('seatsAmountRadioBtnControl').setValue(false);

      expect(markFormAsDirtySpy).toHaveBeenCalled();
      expect(component.seatsAmountControl.enabled).toBe(true);
    });
  });

  describe('markFormAsDirtyOnUserInteraction', () => {
    it('should mark the form as dirty if it is not dirty', () => {
      const markAsDirtySpy = jest.spyOn(component.PositionFormGroup, 'markAsDirty');

      component.markFormAsDirtyOnUserInteraction();

      expect(markAsDirtySpy).toHaveBeenCalledWith({ onlySelf: true });
    });
  });
});
