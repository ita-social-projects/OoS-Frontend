import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { DeclinationPipe } from '../../pipes/declination.pipe';
import { WorkshopCheckboxDropdownComponent } from './workshop-checkbox-dropdown.component';

describe('WorkshopCheckboxDropdownComponent', () => {
  let component: WorkshopCheckboxDropdownComponent;
  let fixture: ComponentFixture<WorkshopCheckboxDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        WorkshopCheckboxDropdownComponent,
        DeclinationPipe
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCheckboxDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});