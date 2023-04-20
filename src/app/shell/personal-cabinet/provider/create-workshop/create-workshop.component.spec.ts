import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateWorkshopComponent } from './create-workshop.component';
import { MatStepperModule } from '@angular/material/stepper';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormArray, FormGroup } from '@angular/forms';
import { Workshop } from '../../../../shared/models/workshop.model';
import { Provider } from '../../../../shared/models/provider.model';
import { Address } from '../../../../shared/models/address.model';
import { Teacher } from '../../../../shared/models/teacher.model';

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
  @Input() isRelease3: boolean;
  @Input() provider: Provider;
}

@Component({
  selector: 'app-create-description-form',
  template: ''
})
class MockCreateDescriptionFormComponent {
  @Input() workshop: Workshop;
  @Input() isRelease3: boolean;
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
  @Input() isRelease3: boolean;
}
