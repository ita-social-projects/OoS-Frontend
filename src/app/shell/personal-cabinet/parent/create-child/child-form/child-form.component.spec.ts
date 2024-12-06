import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { KeyFilterDirective } from 'shared/directives/key-filter.directive';
import { ChildFormComponent } from './child-form.component';

describe('ChildFormComponent', () => {
  let component: ChildFormComponent;
  let fixture: ComponentFixture<ChildFormComponent>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        FormsModule,
        MatRadioModule,
        MatOptionModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatIconModule,
        MatChipsModule,
        NgxsModule.forRoot([]),
        TranslateModule.forRoot()
      ],
      declarations: [ChildFormComponent, MockValidationHintForInputComponent, KeyFilterDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildFormComponent);
    component = fixture.componentInstance;
    component.ChildFormGroup = new FormGroup({
      lastName: new FormControl(''),
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      dateOfBirth: new FormControl(''),
      gender: new FormControl(''),
      socialGroups: new FormControl(''),
      placeOfStudy: new FormControl(''),
      placeOfLiving: new FormControl(''),
      certificateOfBirth: new FormControl('')
    });
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove all chips when language changes', () => {
    const mockChip = { remove: jest.fn() };

    (component as any).chipSet = { _chips: [mockChip] };

    translate.use('uk');

    expect(mockChip.remove).toHaveBeenCalled();
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
