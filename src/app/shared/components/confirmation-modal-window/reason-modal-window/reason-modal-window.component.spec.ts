import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';

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
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            type: ModalConfirmationType.blockProvider,
            property: 'test'
          }
        },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonModalWindowComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('renders without crashing', () => {
    global.scrollTo = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    const spy = jest.spyOn(component, 'onSubmit');

    component.onSubmit();
    component.isPhoneNumberRequired = false;
    component.onSubmit();

    expect(spy).toHaveBeenCalled();
  });

  it('should cancel', () => {
    const spy = jest.spyOn(component, 'onCancel');

    component.onCancel();

    expect(spy).toHaveBeenCalled();
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
