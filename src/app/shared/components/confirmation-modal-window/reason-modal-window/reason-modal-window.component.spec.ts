import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { TextSliceTransformPipe } from 'shared/pipes/text-slice-transform.pipe';
import { ReasonModalWindowComponent } from './reason-modal-window.component';

describe('ReasonModalWindowComponent', () => {
  let component: ReasonModalWindowComponent;
  let fixture: ComponentFixture<ReasonModalWindowComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [ReasonModalWindowComponent, MockValidationHintForInputComponent, TextSliceTransformPipe],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }, { provide: MatDialogRef, useValue: {} }, FormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonModalWindowComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    component.formGroup = formBuilder.group({ reason: new FormControl({ value: 'Reason', disabled: true }, Validators.required) });
    fixture.detectChanges();
  });

  it('renders without crashing', () => {
    global.scrollTo = jest.fn();
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
}
