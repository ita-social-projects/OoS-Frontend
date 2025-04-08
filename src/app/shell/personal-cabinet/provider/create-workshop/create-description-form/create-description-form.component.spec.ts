import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, forwardRef, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { MaterialModule } from 'shared/modules/material.module';
import { ImageFormControlComponent } from 'shared/components/image-form-control/image-form-control.component';
import { of } from 'rxjs';
import { Workshop } from 'shared/models/workshop.model';
import { TagService } from 'shared/services/workshops/tag-workshop/tag-workshop.service';
import { CreateDescriptionFormComponent } from './create-description-form.component';

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

describe('CreateDescriptionFormComponent', () => {
  let component: CreateDescriptionFormComponent;
  let fixture: ComponentFixture<CreateDescriptionFormComponent>;

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
      declarations: [CreateDescriptionFormComponent, ImageFormControlComponent, MockValidationHintAboutComponent, MockInfoFormComponent],
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
              paramMap: convertToParamMap({ param: 'someValue' }),
              params: {},
              data: {}
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDescriptionFormComponent);
    component = fixture.componentInstance;
    component.provider = {} as any;
    component.workshop = {
      competitiveSelection: false,
      competitiveSelectionDescription: '',
      keywords: []
    } as any;
    component.DescriptionFormGroup = new FormGroup({
      imageFiles: new FormControl(''),
      imageIds: new FormControl(['id1', 'id2', 'id3']),
      description: new FormControl(''),
      disabilityOptionsDesc: new FormControl(''),
      keyWords: new FormControl(''),
      formOfLearning: new FormControl(''),
      competitiveSelection: new FormControl(''),
      tagIds: new FormControl([]),
      isSelfFinanced: new FormControl(false),
      enrollmentProcedureDescription: new FormControl('some description'),
      isInclusive: new FormControl(false),
      specialNeedsType: new FormControl('None'),
      areThereBenefits: new FormControl(false),
      preferentialTermsOfParticipation: new FormControl(''),
      educationalShift: new FormControl('First'),
      ageComposition: new FormControl('SameAge'),
      coverage: new FormControl('School'),
      workshopType: new FormControl('None')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a keyword', () => {
    component.keyWordsCtrl.setValue('Test');

    component.onKeyWordsInput();

    expect(component.keyWords).toEqual(['test']);
    expect(component.keyWordsCtrl.value).toBe('');
  });

  it('should disable input if the keyword limit is reached', () => {
    component.keyWords = ['one', 'two', 'three', 'four'];
    component.keyWordsCtrl.setValue('five');

    component.onKeyWordsInput();

    expect(component.keyWordsCtrl.disabled).toBeTruthy();
  });

  it('should enable input if the keyword limit is less than 5', () => {
    component.keyWords = ['one', 'two', 'three', 'four', 'five'];

    component.onRemoveKeyWord('one');

    expect(component.keyWordsCtrl.disabled).toBeFalsy();
  });

  it('should remove a keyword', () => {
    component.keyWords = ['one', 'two', 'three', 'four'];

    component.onRemoveKeyWord('four');

    expect(component.keyWords.length).toBe(3);
  });

  it('should remove tag from selection', () => {
    const mockTag = { id: 1, name: 'TestTag' };
    component.tagsControl.setValue([mockTag]);
    component.onRemoveItem(mockTag);
    expect(component.tagsControl.value).toEqual([]);
  });

  it('should activate edit mode with workshop data', () => {
    component.workshop = {
      id: 1,
      keywords: ['test'],
      withDisabilityOptions: true,
      workshopDescriptionItems: [
        {
          sectionName: 'test section',
          description: 'test description'
        }
      ]
    } as any;

    component.activateEditMode();
    expect(component.keyWords).toContain('test');
    expect(component.disabilityOptionRadioBtn.value).toBe(true);
  });

  it('should set tags for workshop and form field', fakeAsync(() => {
    const mockTags = [
      { id: 1, name: 'Tag 1' },
      { id: 2, name: 'Tag 2' },
      { id: 3, name: 'Tag 3' }
    ];

    const mockWorkshop: Partial<Workshop> = {
      tagIds: [1],
      competitiveSelection: true
    };

    const tagService = TestBed.inject(TagService);
    jest.spyOn(tagService, 'getTags').mockReturnValue(of(mockTags));

    component.workshop = mockWorkshop as Workshop;

    component.ngOnInit();
    tick();

    expect(component.tags).toEqual(mockTags);
    expect(component.tagsControl.value).toEqual([mockTags[0]]);
  }));

  it('should update tagIds in form group', () => {
    const mockTags = [
      { id: 1, name: 'tag1' },
      { id: 2, name: 'tag2' }
    ];

    (component as any).updateTagIds(mockTags);

    expect(component.DescriptionFormGroup.get('tagIds').value).toEqual([1, 2]);
  });

  it('should mark form as dirty after deletion', () => {
    component.onAddForm();
    component.DescriptionFormGroup.markAsPristine();
    component.onDeleteForm(0);

    expect(component.DescriptionFormGroup.dirty).toBe(true);
  });

  it('should mark tagsControl as touched on tagIds touch', () => {
    component.DescriptionFormGroup.get('tagIds').markAsTouched();
    expect(component.tagsControl.touched).toEqual(true);
  });
});
