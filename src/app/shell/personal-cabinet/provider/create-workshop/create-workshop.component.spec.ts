import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateWorkshopComponent } from './create-workshop.component';
import { MatStepperModule } from '@angular/material/stepper';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { Address } from 'src/app/shared/models/address.model';
import { FormArray, FormGroup } from '@angular/forms';
import { Provider } from 'src/app/shared/models/provider.model';

describe('CreateWorkshopComponent', () => {
  let component: CreateWorkshopComponent;
  let fixture: ComponentFixture<CreateWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatStepperModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
        HttpClientTestingModule
      ],
      declarations: [
        CreateWorkshopComponent,
        MockCreateAddressComponent,
        MockCreateTeacherComponent,
        MockCreateAboutFormComponent,
        MockCreateDescriptionFormComponent
      ]
    })
      .compileComponents();
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
  @Input() isRelease2: boolean;
  @Input() provider: Provider;
}

@Component({
  selector: 'app-create-description-form',
  template: ''
})
class MockCreateDescriptionFormComponent {
  @Input() workshop: Workshop;
  @Input() isRelease2: boolean;
  @Input() provider: Provider;
}

@Component({
  selector: 'app-create-address',
  template: ''
})
class MockCreateAddressComponent {
  @Input() address: Address;
}

@Component({
  selector: 'app-create-teacher',
  template: ''
})
class MockCreateTeacherComponent {
  @Input() teachers: Teacher[];
  @Input() isRelease2: boolean;
}
