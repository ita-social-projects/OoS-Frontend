import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { Competition } from 'shared/models/competition.model';
import { Address } from '../../../../shared/models/address.model';
import { Provider } from '../../../../shared/models/provider.model';
import { CreateCompetitionComponent } from './create-competition.component';

describe('CreateCompetitionComponent', () => {
  let component: CreateCompetitionComponent;
  let fixture: ComponentFixture<CreateCompetitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatStepperModule, RouterTestingModule, BrowserAnimationsModule, NgxsModule.forRoot([]), HttpClientTestingModule],
      declarations: [
        CreateCompetitionComponent,
        MockCreateCompetitionAddressComponent,
        MockCreateRequiredFormComponent,
        MockCreateDescriptionFormComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompetitionComponent);
    component = fixture.componentInstance;
    component.RequiredFormGroup = new FormGroup({});
    component.ContactsFormArray = new FormArray([]);
    component.DescriptionFormGroup = new FormGroup({});
    component.JudgeFormArray = new FormArray([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-create-required-form',
  template: ''
})
class MockCreateRequiredFormComponent {
  @Input() competition: Competition;
  @Input() isImagesFeature: boolean;
  @Input() provider: Provider;
}

@Component({
  selector: 'app-create-competition-description-form',
  template: ''
})
class MockCreateDescriptionFormComponent {
  @Input() competition: Competition;
  @Input() isImagesFeature: boolean;
  @Input() provider: Provider;
}

@Component({
  selector: 'app-create-competition-address',
  template: ''
})
class MockCreateCompetitionAddressComponent {
  @Input() address: Address;
}
