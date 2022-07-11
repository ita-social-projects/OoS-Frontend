import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@microsoft/signalr';
import { NgxsModule } from '@ngxs/store';
import { Component, Input } from '@angular/core';

import { CreateAchievementComponent } from './create-achievement.component';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Achievement } from 'src/app/shared/models/achievement.model';

describe('CreateAchievementComponent', () => {
  let component: CreateAchievementComponent;
  let fixture: ComponentFixture<CreateAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot([]),
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule,
        MatIconModule
      ],
      declarations: [CreateAchievementComponent, MockMainWorkshopCardComponent, MockValidationHintForInputComponent],
      providers: [HttpClient, { provide: APP_BASE_HREF, useValue: '/' }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAchievementComponent);
    component = fixture.componentInstance;
    component.AchievementFormGroup = new FormGroup({
      title: new FormControl(''),
      teachers: new FormControl(''), 
      childrenIDs: new FormControl(''),  
      achievementTypeId: new FormControl(''),
      achievementDate: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-workshop-card',
  template: '',
})
class MockMainWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() workshopId: string;
  @Input() isMainPage: boolean;
  @Input() userRole: string;
  @Input() parent: boolean;
  @Input() isHorizontalView: boolean;
  @Input() isCreateApplicationView: boolean;
}
@Component({
  selector: 'app-validation-hint',
  template: ''
})

class MockValidationHintForInputComponent {
  @Input() validationFormControl: FormControl; 
  @Input() isTouched: boolean;
  @Input() minMaxDate: boolean;
  @Input() maxCharachters: number;
  @Input() minCharachters: number;
}
