import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { ModalConfirmationButtonText, ModalConfirmationType, ModalConfirmationTypeWithQuotes } from 'shared/enum/modal-confirmation';
import { StarsComponent } from '../../../shell/details/details-tabs/reviews/stars/stars.component';
import { ConfirmationModalWindowComponent } from './confirmation-modal-window.component';

describe('ConfirmationModalWindowComponent', () => {
  let component: ConfirmationModalWindowComponent;
  let fixture: ComponentFixture<ConfirmationModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, FormsModule, ReactiveFormsModule, MatButtonToggleModule, MatIconModule, TranslateModule.forRoot()],
      declarations: [ConfirmationModalWindowComponent, StarsComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            type: ModalConfirmationTypeWithQuotes.delete,
            property: 'test'
          }
        },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return rate confirmation button text when data.type is rate', () => {
    component.data.type = ModalConfirmationType.rate;

    const message = component.getConfirmationButtonMessage();

    expect(message).toBe(ModalConfirmationButtonText.rate);
  });

  it('should return default confirmation button text when data.type is undefined', () => {
    component.data.type = undefined;

    const message = component.getConfirmationButtonMessage();

    expect(message).toBe(ModalConfirmationButtonText.default);
  });
});
