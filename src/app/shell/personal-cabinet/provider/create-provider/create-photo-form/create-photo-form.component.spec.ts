import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { ImageFormControlComponent } from 'shared/components/image-form-control/image-form-control.component';
import { CreatePhotoFormComponent } from './create-photo-form.component';

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
        MatGridListModule,
        MatDialogModule,
        TranslateModule.forRoot()
      ],
      declarations: [CreatePhotoFormComponent, ImageFormControlComponent, MockValidationHintForInputComponent, MockInfoFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePhotoFormComponent);
    component = fixture.componentInstance;
    component.PhotoFormGroup = new FormGroup({
      imageFiles: new FormControl(''),
      imageIds: new FormControl(['id1', 'id2', 'id3']),
      description: new FormControl('', Validators.required),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      website: new FormControl('')
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
  @Input() minCharacters: number;
  @Input() maxCharacters: number;
  @Input() minMaxDate: boolean;
  @Input() isTouched: boolean;
}

@Component({
  selector: 'app-info-form',
  template: ''
})
class MockInfoFormComponent {
  @Input() index: number;
  @Input() formAmount: number;
  @Input() infoEditFormGroup: FormGroup;
  @Input() maxDescriptionLength: number;
}
