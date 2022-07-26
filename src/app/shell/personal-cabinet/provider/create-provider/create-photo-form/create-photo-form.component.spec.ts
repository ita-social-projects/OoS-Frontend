import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePhotoFormComponent } from './create-photo-form.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxsModule } from '@ngxs/store';
import { ImageFormControlComponent } from '../../../../../shared/components/image-form-control/image-form-control.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { Component, Input } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

describe('CreatePhotoFormComponent', () => {
  let component: CreatePhotoFormComponent;
  let fixture: ComponentFixture<CreatePhotoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
        MatIconModule,
        MatOptionModule,
        MatSelectModule,
        MatGridListModule
      ],
      declarations: [
        CreatePhotoFormComponent,
        ImageFormControlComponent,
        MockValidationHintForInputComponent,
        MockInfoFormComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePhotoFormComponent);
    component = fixture.componentInstance;
    component.PhotoFormGroup = new FormGroup({
      image: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      institutionStatusId: new FormControl(''),
      institutionType: new FormControl(''),
      institution: new FormControl(''),
      founder: new FormControl(''),
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

class MockValidationHintForInputComponent {
  @Input() validationFormControl: FormControl; 
  @Input() minCharachters: number;
  @Input() maxCharachters: number;
  @Input() minMaxDate: boolean;
  @Input() isTouched: boolean;
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