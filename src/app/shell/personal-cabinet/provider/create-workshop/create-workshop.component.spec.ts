import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { Address } from '../../../../shared/models/address.model';
import { Provider } from '../../../../shared/models/provider.model';
import { Teacher } from '../../../../shared/models/teacher.model';
import { Workshop } from '../../../../shared/models/workshop.model';
import { CreateWorkshopComponent } from './create-workshop.component';

describe('CreateWorkshopComponent', () => {
  let component: CreateWorkshopComponent;
  let fixture: ComponentFixture<CreateWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatStepperModule, RouterTestingModule, BrowserAnimationsModule, NgxsModule.forRoot([]), HttpClientTestingModule],
      declarations: [
        CreateWorkshopComponent,
        MockCreateWorkshopAddressComponent,
        MockCreateTeacherComponent,
        MockCreateAboutFormComponent,
        MockCreateDescriptionFormComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkshopComponent);
    component = fixture.componentInstance;
    component.AboutFormGroup = new FormGroup({});
    component.AddressFormGroup = new FormGroup({});
    component.DescriptionFormGroup = new FormGroup({});
    component.TeacherFormArray = new FormArray([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-create-about-form',
  template: ''
})
class MockCreateAboutFormComponent {
  @Input() workshop: Workshop;
  @Input() isImagesFeature: boolean;
  @Input() provider: Provider;
}

@Component({
  selector: 'app-create-description-form',
  template: ''
})
class MockCreateDescriptionFormComponent {
  @Input() workshop: Workshop;
  @Input() isImagesFeature: boolean;
  @Input() provider: Provider;
}

@Component({
  selector: 'app-create-workshop-address',
  template: ''
})
class MockCreateWorkshopAddressComponent {
  @Input() address: Address;
}

@Component({
  selector: 'app-create-teacher',
  template: ''
})
class MockCreateTeacherComponent {
  @Input() teachers: Teacher[];
  @Input() isImagesFeature: boolean;
}
