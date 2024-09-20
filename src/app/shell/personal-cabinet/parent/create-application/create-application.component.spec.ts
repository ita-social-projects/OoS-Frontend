import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { Child } from 'shared/models/child.model';
import { Parent } from 'shared/models/parent.model';
import { Workshop } from 'shared/models/workshop.model';
import { CreateApplicationComponent } from './create-application.component';

describe('CreateApplicationComponent', () => {
  let component: CreateApplicationComponent;
  let fixture: ComponentFixture<CreateApplicationComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatTabsModule,
        RouterTestingModule,
        MatDialogModule,
        MatCheckboxModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        CreateApplicationComponent,
        MockPersonCardComponent,
        MockValidationHintForInputComponent,
        MockMainWorkshopCardComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue(() => of({ id: '1' } as Parent));
    fixture = TestBed.createComponent(CreateApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-person-card',
  template: ''
})
class MockPersonCardComponent {
  @Input() child: Child;
}

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintForInputComponent {
  @Input() validationFormControl: FormControl;
  @Input() isTouched: boolean;
}

@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockMainWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isHorizontalView: boolean;
  @Input() isCreateFormView: boolean;
}
