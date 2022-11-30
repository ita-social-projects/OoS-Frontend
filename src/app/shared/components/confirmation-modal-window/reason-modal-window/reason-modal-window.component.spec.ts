import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReasonModalWindowComponent } from './reason-modal-window.component';
import { TextSliceTransformPipe } from '../../../pipes/text-slice-transform.pipe';

describe('ReasonModalWindowComponent', () => {
  let component: ReasonModalWindowComponent;
  let fixture: ComponentFixture<ReasonModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
      declarations: [ReasonModalWindowComponent, MockValidationHintForInputComponent, TextSliceTransformPipe],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonModalWindowComponent);
    component = fixture.componentInstance;
    component.ReasonFormControl = new FormControl({ value: 'Reason', disabled: true }, Validators.required);
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
  @Input() minCharachters: number;
  @Input() maxCharachters: number;
}
