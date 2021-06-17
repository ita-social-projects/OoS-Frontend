import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProviderComponent } from './create-provider.component';
import { Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../../../shared/mocks/mock-services';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

describe('CreateProviderComponent', () => {
  let component: CreateProviderComponent;
  let fixture: ComponentFixture<CreateProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatStepperModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        NgxsModule.forRoot([]),
        MatDialogModule
      ],
      declarations: [
        CreateProviderComponent,
        MockCreatePhotoFormComponent,
        MockCreateInfoComponent,
        MockCreateContactsFormComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-create-contacts-form',
  template: ''
})
class MockCreateContactsFormComponent {
}

@Component({
  selector: 'app-create-info-form',
  template: ''
})
class MockCreateInfoComponent {
}

@Component({
  selector: 'app-create-photo-form',
  template: ''
})
class MockCreatePhotoFormComponent {
}
