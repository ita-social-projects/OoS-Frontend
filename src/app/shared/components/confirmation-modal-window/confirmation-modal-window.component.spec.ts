import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef
} from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ModalConfirmationTypeWithQuotes } from 'shared/enum/modal-confirmation';
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
});
