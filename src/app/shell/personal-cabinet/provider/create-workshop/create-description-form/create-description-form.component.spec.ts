import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { ImageFormControlComponent } from 'shared/components/image-form-control/image-form-control.component';
import { Provider } from 'shared/models/provider.model';
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
      declarations: [
        CreateDescriptionFormComponent,
        ImageFormControlComponent,
        MockValidationHintAboutComponent,
        MockInfoFormComponent,
        MockInstitutionHierarchyComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDescriptionFormComponent);
    component = fixture.componentInstance;
    component.DescriptionFormGroup = new FormGroup({
      imageFiles: new FormControl(''),
      description: new FormControl(''),
      disabilityOptionsDesc: new FormControl(''),
      head: new FormControl(''),
      keyWords: new FormControl(''),
      categories: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

@Component({
  selector: '<app-institution-hierarchy',
  template: ''
})
class MockInstitutionHierarchyComponent {
  @Input() institutionHierarchyIdFormControl: FormControl;
  @Input() institutionIdFormControl: FormControl;
  @Input() provider: Provider;
}
