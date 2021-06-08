import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildFormComponent } from './child-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';

describe('ChildFormComponent', () => {
  let component: ChildFormComponent;
  let fixture: ComponentFixture<ChildFormComponent>;

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
        MatIconModule
      ],
      declarations: [ ChildFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildFormComponent);
    component = fixture.componentInstance;
    component.ChildFormGroup = new FormGroup({
      lastName: new FormControl(''),
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      birthDay: new FormControl(''),
      gender: new FormControl(''),
      type: new FormControl('')
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
