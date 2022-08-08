import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateApplicationComponent } from './create-application.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatInputModule } from '@angular/material/input';
import { Component, Input } from '@angular/core';
import { cardType } from 'src/app/shared/enum/role';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { Parent } from 'src/app/shared/models/parent.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Workshop } from 'src/app/shared/models/workshop.model';

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
        MatCheckboxModule
      ],
      declarations: [
        CreateApplicationComponent,
        MockPersonCardComponent,
        MockValidationHintForInputComponent,
        MockMainWorkshopCardComponent
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, 'selectSnapshot').and.returnValue({ id: '1' } as Parent);
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
  @Input() card;
  @Input() cardType: cardType;
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
  @Input() workshopId: string;
  @Input() isMainPage: boolean;
  @Input() userRole: string;
  @Input() parent: boolean;
  @Input() isHorizontalView: boolean;
  @Input() isCreateApplicationView: boolean;
}
