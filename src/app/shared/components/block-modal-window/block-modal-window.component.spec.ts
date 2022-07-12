import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockModalWindowComponent } from './block-modal-window.component';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalConfirmationText, ModalConfirmationTitle } from '../../enum/modal-confirmation';

describe('BlockModalWindowComponent', () => {
  let component: BlockModalWindowComponent;
  let fixture: ComponentFixture<BlockModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      declarations: [
        BlockModalWindowComponent,
        MockValidationHintForInputComponent
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockModalWindowComponent);
    component = fixture.componentInstance;
    component.ReasonFormControl = new FormControl({ value: 'Reason', disabled: true }, Validators.required)
    component.modalTitle = ModalConfirmationTitle.blockParent;
    component.modalDescription = ModalConfirmationText.blockParent;
    fixture.detectChanges();
  });

  it("renders without crashing", () => {
    global.scrollTo = jest.fn()
  })

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
