import { MatIconModule } from '@angular/material/icon';
import { StarsComponent } from '../../../shell/details/details-tabs/reviews/stars/stars.component';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmationModalWindowComponent } from './confirmation-modal-window.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

describe('ConfirmationModalWindowComponent', () => {
  let component: ConfirmationModalWindowComponent;
  let fixture: ComponentFixture<ConfirmationModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, FormsModule, ReactiveFormsModule, MatButtonToggleModule, MatIconModule],
      declarations: [ConfirmationModalWindowComponent, StarsComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
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
