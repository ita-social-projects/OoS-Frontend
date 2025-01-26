import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@microsoft/signalr';
import { NgxsModule } from '@ngxs/store';

import { Workshop } from 'shared/models/workshop.model';
import { GetFullNamePipe } from 'shared/pipes/get-full-name.pipe';
import { CreateAchievementComponent } from './create-achievement.component';

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
        MatIconModule,
        MatDialogModule
      ],
      declarations: [CreateAchievementComponent, MockMainWorkshopCardComponent, MockValidationHintForInputComponent, GetFullNamePipe],
      providers: [HttpClient, { provide: APP_BASE_HREF, useValue: '/' }]
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
      achievementDate: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockMainWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() workshopId: string;
  @Input() isCreateFormView: boolean;
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
  @Input() maxCharacters: number;
  @Input() minCharacters: number;
}
