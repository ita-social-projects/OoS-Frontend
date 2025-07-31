import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, forwardRef, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MaterialModule } from 'shared/modules/material.module';
import { ImageFormControlComponent } from 'shared/components/image-form-control/image-form-control.component';
import { GetSubDirections } from 'shared/store/meta-data.actions';
import { SubDirection } from 'shared/models/category.model';
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
  let store: Store;
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
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '123'
              }
            }
          }
        },
        Store
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompetitionDescriptionFormComponent);
    component = fixture.componentInstance;
    component.provider = {} as any;
    component.competition = {
      competitiveSelection: false,
      competitiveSelectionDescription: '',
      keywords: [],
      subDirectionIds: []
    } as any;
    component.DescriptionFormGroup = new FormGroup({
      imageFiles: new FormControl(''),
      imageIds: new FormControl(['id1', 'id2', 'id3']),
      description: new FormControl(''),
      formOfLearning: new FormControl(''),
      competitiveSelection: new FormControl(true),
      tagIds: new FormControl([]),
      isSelfFinanced: new FormControl(false),
      enrollmentProcedureDescription: new FormControl(''),
      specialNeedsType: new FormControl('None'),
      areThereBenefits: new FormControl(false),
      preferentialTermsOfParticipation: new FormControl(''),
      educationalShift: new FormControl('First'),
      ageComposition: new FormControl('SameAge'),
      coverage: new FormControl('School'),
      directionId: new FormControl(null),
      subDirectionIds: new FormControl(null)
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  describe('directions', () => {
    it('should reset subDirections control and dispatch GetSubDirections when direction has changed', () => {
      const direction = component.DescriptionFormGroup.get('directionId');
      const subDirection = component.DescriptionFormGroup.get('subDirectionIds');
      jest.spyOn(subDirection, 'reset');
      jest.spyOn(store, 'dispatch');
      direction.setValue('1');
      expect(subDirection.reset).toHaveBeenCalled();
      expect(subDirection.value).toBeNull();
      expect(store.dispatch).toHaveBeenCalledWith(new GetSubDirections('1'));
    });

    it('should set direction and subDirection value if competition has property', fakeAsync(() => {
      const direction = component.DescriptionFormGroup.get('directionId');
      const subDirection = component.DescriptionFormGroup.get('subDirectionIds');

      Object.defineProperty(component, 'subDirections$', { writable: true });
      component.subDirections$ = of([
        { id: 1, title: 'Sub1' },
        { id: 2, title: 'Sub2' }
      ] as SubDirection[]);

      component.competition.subDirectionIds = [2];
      component.competition.directionSubDirectionIds = [{ directionId: 1, subDirectionId: 2 }];

      component.activateEditMode();

      tick();

      expect(direction.value).toEqual(1);
      expect(subDirection.value).toEqual([{ id: 2, title: 'Sub2' }]);
    }));

    it('should remove the given item from subDirectionControl and patch the new value', () => {
      const subDirection = component.DescriptionFormGroup.get('subDirectionIds');
      subDirection.setValue([
        { id: 1, title: 'Sub1' },
        { id: 2, title: 'Sub2' },
        { id: 3, title: 'Sub3' }
      ]);

      const itemToRemove = { id: 2, title: 'Sub2' } as SubDirection;

      component.onRemove(itemToRemove);

      expect(subDirection.value).toEqual([
        { id: 1, title: 'Sub1' },
        { id: 3, title: 'Sub3' }
      ]);
    });

    it('should compare subDirections correctly', () => {
      const sub1 = { id: 1, title: 'Sub1' } as SubDirection;
      let sub2 = { id: 2, title: 'Sub2' } as SubDirection;

      expect(component.compareItems(sub1, sub2)).toBe(false);

      sub2.id = 1;
      expect(component.compareItems(sub1, sub2)).toBe(true);

      sub2.id = null;
      expect(component.compareItems(sub1, sub2)).toBe(false);

      sub2 = undefined;
      expect(component.compareItems(sub1, sub2)).toBe(false);
    });
  });
});
