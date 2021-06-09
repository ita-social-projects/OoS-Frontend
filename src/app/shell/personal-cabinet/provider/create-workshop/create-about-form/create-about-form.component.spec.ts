import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAboutFormComponent } from './create-about-form.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxsModule } from '@ngxs/store';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ImageFormControlComponent } from '../../../../../shared/components/image-form-control/image-form-control.component';
import { WorkingHoursFormControlComponent } from '../../../../../shared/components/working-hours-form-control/working-hours-form-control.component';
import { MatSelectModule } from '@angular/material/select';

describe('CreateAboutFormComponent', () => {
  let component: CreateAboutFormComponent;
  let fixture: ComponentFixture<CreateAboutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        NgxsModule.forRoot([]),
        MatInputModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatOptionModule,
        MatRadioModule,
        MatButtonToggleModule,
        MatIconModule,
        MatSelectModule
      ],
      declarations: [
        CreateAboutFormComponent,
        ImageFormControlComponent,
        WorkingHoursFormControlComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAboutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// @Component({
//   selector: 'app-working-hours-form-control',
//   template: ''
// })
// class MockWorkingHoursFormControlComponent {
//   @Input() workHour: SelectedWorkingHours;
//   @Input() index: number;
//   @Input() workingHoursAmount: number;
// }
