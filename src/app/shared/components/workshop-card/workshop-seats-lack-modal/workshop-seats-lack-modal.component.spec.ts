import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef
} from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { WorkshopSeatsLackModalComponent } from './workshop-seats-lack-modal.component';

describe('WorkshopSeatsLackModalComponent', () => {
  let component: WorkshopSeatsLackModalComponent;
  let fixture: ComponentFixture<WorkshopSeatsLackModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatIconModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [WorkshopSeatsLackModalComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopSeatsLackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
