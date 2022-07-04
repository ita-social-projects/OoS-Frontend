import { ValidationHintComponent } from './../../../../../shared/components/validation-hint/validation-hint.component';
import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateDescriptionFormComponent } from './create-description-form.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ImageFormControlComponent } from '../../../../../shared/components/image-form-control/image-form-control.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Provider } from 'src/app/shared/models/provider.model';

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
        MatTooltipModule
      ],
      declarations: [
        CreateDescriptionFormComponent,
        MockCategorySelectComponent,
        ImageFormControlComponent,
        MockValidationHintAboutComponent,
        MockInfoFormComponent,
        MockIstitutionHierarchyComponent
      ],
    })
      .compileComponents();
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
  selector: 'app-category-select',
  template: ''
})
class MockCategorySelectComponent {
  @Input() workshop: Workshop;
  @Input() CategoryFormGroup: FormGroup;
}

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintAboutComponent {
  @Input() validationFormControl: FormControl; //required for validation
  @Input() minCharachters: number;
  @Input() maxCharachters: number;
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
class MockIstitutionHierarchyComponent {
  @Input() instituitionHierarchyIdFormControl: FormControl;
  @Input() instituitionIdFormControl: FormControl;
  @Input() provider: Provider;
}