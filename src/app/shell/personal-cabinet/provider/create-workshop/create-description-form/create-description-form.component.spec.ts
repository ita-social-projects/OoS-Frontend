import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { Workshop } from 'shared/models/workshop.model';

import { ImageFormControlComponent } from 'shared/components/image-form-control/image-form-control.component';
import { CreateDescriptionFormComponent } from './create-description-form.component';

describe('CreateDescriptionFormComponent', () => {
  let component: CreateDescriptionFormComponent;
  let fixture: ComponentFixture<CreateDescriptionFormComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatChipsModule,
        NgxsModule.forRoot([]),
        MatInputModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatRadioModule,
        MatGridListModule,
        MatTooltipModule,
        TranslateModule.forRoot()
      ],
      declarations: [CreateDescriptionFormComponent, ImageFormControlComponent, MockValidationHintAboutComponent, MockInfoFormComponent]
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
      head: new FormControl(''),
      keyWords: new FormControl(''),
      website: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      formOfLearning: new FormControl(''),
      competitiveSelection: new FormControl(''),
      categories: new FormControl(''),
      institutionHierarchyId: new FormControl(''),
      institutionId: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add keyword', () => {
    component.keyWordsCtrl.setValue('Test');

    component.onKeyWordsInput();

    expect(component.keyWords).toEqual(['test']);
    expect(component.keyWordsCtrl.value).toBe('');
  });

  it('should disable input if keyword limit is reached', () => {
    component.keyWords = ['one', 'two', 'three', 'four'];
    component.keyWordsCtrl.setValue('Test');

    component.onKeyWordsInput();

    expect(component.keyWordsCtrl.disabled).toBeTruthy();
  });

  it('should enable input if keyword limit is less than 5', () => {
    component.keyWords = ['one', 'two', 'three', 'four', 'five'];

    component.onRemoveKeyWord('one');

    expect(component.keyWordsCtrl.disabled).toBeFalsy();
  });
  it('should remove keyword', () => {
    component.keyWords = ['one', 'two', 'three', 'four', 'five'];

    component.onRemoveKeyWord('five');

    expect(component.keyWords.length).toBe(4);
  });
});

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintAboutComponent {
  @Input() validationFormControl: FormControl; // required for validation
  @Input() minCharacters: number;
  @Input() maxCharacters: number;
  @Input() minMaxDate: boolean;
}

@Component({
  selector: 'app-info-form',
  template: ''
})
class MockInfoFormComponent {
  @Input() InfoEditFormGroup: FormGroup;
  @Input() index: number;
  @Input() formAmount: number;
  @Input() maxDescriptionLength: number;
}
