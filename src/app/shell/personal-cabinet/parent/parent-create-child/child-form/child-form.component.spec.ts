import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildFormComponent } from './child-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ChildFormComponent', () => {
  let component: ChildFormComponent;
  let fixture: ComponentFixture<ChildFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatDatepickerModule,
        MatRadioModule,
        MatSelectModule,
        MatOptionModule,
        MatNativeDateModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      declarations: [ ChildFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
