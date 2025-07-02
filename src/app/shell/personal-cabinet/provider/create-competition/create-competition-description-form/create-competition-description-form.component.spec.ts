import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, forwardRef, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'shared/modules/material.module';
import { ImageFormControlComponent } from 'shared/components/image-form-control/image-form-control.component';
import { Competition } from 'shared/models/competition.model';
import { CreateCompetitionDescriptionFormComponent } from './create-competition-description-form.component';

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintAboutComponent {
  @Input() validationFormControl!: FormControl; // required for validation
  @Input() minCharacters!: number;
  @Input() maxCharacters!: number;
  @Input() minMaxDate!: boolean;
}

@Component({
  selector: 'app-info-form',
  template: ''
})
class MockInfoFormComponent {
  @Input() InfoEditFormGroup!: FormGroup;
  @Input() index!: number;
  @Input() formAmount!: number;
  @Input() maxDescriptionLength!: number;
}

describe('CreateCompetitionDescriptionFormComponent', () => {
  let component: CreateCompetitionDescriptionFormComponent;
  let fixture: ComponentFixture<CreateCompetitionDescriptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
        NgxsModule.forRoot([]),
        TranslateModule.forRoot()
      ],
      declarations: [
        CreateCompetitionDescriptionFormComponent,
        ImageFormControlComponent,
        MockValidationHintAboutComponent,
        MockInfoFormComponent
      ],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          // eslint-disable-next-line @angular-eslint/no-forward-ref
          useExisting: forwardRef(() => ImageFormControlComponent),
          multi: true
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompetitionDescriptionFormComponent);
    component = fixture.componentInstance;
    component.provider = {} as any;
    component.competition = {
      competitiveSelection: false,
      competitiveSelectionDescription: '',
      keywords: []
    } as any;
    component.DescriptionFormGroup = new FormGroup({
      imageFiles: new FormControl(''),
      imageIds: new FormControl(['id1', 'id2', 'id3']),
      description: new FormControl(''),
      formOfLearning: new FormControl(''),
      competitiveSelection: new FormControl(''),
      tagIds: new FormControl([]),
      isSelfFinanced: new FormControl(false),
      enrollmentProcedureDescription: new FormControl(''),
      specialNeedsType: new FormControl('None'),
      areThereBenefits: new FormControl(false),
      preferentialTermsOfParticipation: new FormControl(''),
      educationalShift: new FormControl('First'),
      ageComposition: new FormControl('SameAge'),
      coverage: new FormControl('School')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tags for competition and form field', fakeAsync(() => {
    const mockCompetition: Partial<Competition> = {
      competitiveSelection: true
    };
    component.competition = mockCompetition as Competition;

    component.ngOnInit();
    tick();
  }));

  it('should mark form as dirty after deletion', () => {
    component.onAddForm();
    component.DescriptionFormGroup.markAsPristine();
    component.onDeleteForm(0);

    expect(component.DescriptionFormGroup.dirty).toBe(true);
  });

  describe('price radio listener', () => {
    it('should set benefits radio to false if participation is free', () => {
      component.priceRadioBtn.setValue(true);
      component.priceControl.setValue(1, { emitEvent: false });
      component.benefitsOptionRadioBtn.setValue(true);
      component.DescriptionFormGroup.get('benefitsOptionsDesc').setValue('some val');
      component.priceRadioBtn.setValue(false);

      expect(component.benefitsOptionRadioBtn.value).toBe(false);
      expect(component.DescriptionFormGroup.get('benefitsOptionsDesc').value).toBeFalsy();
    });

    it('should not touch benefits radio if price was changed', () => {
      component.priceRadioBtn.setValue(true);
      component.priceControl.setValue(1);
      component.benefitsOptionRadioBtn.setValue(true);
      component.DescriptionFormGroup.get('benefitsOptionsDesc').setValue('some val');
      component.priceControl.setValue(12);

      expect(component.benefitsOptionRadioBtn.value).toBe(true);
      expect(component.DescriptionFormGroup.get('benefitsOptionsDesc').value).toEqual('some val');
    });
  });
});
