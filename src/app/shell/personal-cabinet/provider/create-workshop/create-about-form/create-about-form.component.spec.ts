import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAboutFormComponent } from './create-about-form.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatSelectModule } from '@angular/material/select';
import { Provider } from 'src/app/shared/models/provider.model';
import { MatGridListModule } from '@angular/material/grid-list';
import { Component, Input } from '@angular/core';
import { MinMaxDirective } from 'src/app/shared/directives/min-max.directive';
import { WorkingHoursFormComponent } from 'src/app/shared/components/working-hours-form/working-hours-form.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

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
        MatSelectModule,
        MatGridListModule,
        NgxMatTimepickerModule
      ],
      declarations: [
        CreateAboutFormComponent,
        ImageFormControlComponent,
        WorkingHoursFormComponent,
        MockValidationHintForInputComponent,
        MinMaxDirective
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAboutFormComponent);
    component = fixture.componentInstance;
    component.provider = { fullTitle: '' } as Provider;
    component.AboutFormGroup = new FormGroup({});
    fixture.detectChanges();
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
  @Input() minMaxDate: boolean;
}
