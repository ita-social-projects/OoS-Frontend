import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { Provider } from 'shared/models/provider.model';
import { MetaDataState } from 'shared/store/meta-data.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateProviderComponent } from './create-provider.component';

describe('CreateProviderComponent', () => {
  let component: CreateProviderComponent;
  let fixture: ComponentFixture<CreateProviderComponent>;
  let fb: FormBuilder;
  let store: Store;

  const mockFeaturesList: { images: boolean } = {
    images: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatStepperModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([MetaDataState]),
        MatDialogModule
      ],
      declarations: [CreateProviderComponent, MockCreatePhotoFormComponent, MockCreateInfoComponent, MockCreateContactsFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProviderComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    store = TestBed.inject(Store);

    component.InfoFormGroup = fb.group({
      fullTitle: new FormControl('')
    });
    component.LegalAddressFormGroup = fb.group({
      fullTitle: new FormControl('')
    });
    component.ActualAddressFormGroup = fb.group({
      fullTitle: new FormControl('')
    });

    jest.spyOn(store, 'select').mockReturnValue(of(mockFeaturesList));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to featuresList and set isImagesFeature', () => {
    component.ngOnInit();
    expect(component.isImagesFeature).toBe(true);
  });

  it('should select featuresList from the store', () => {
    component.ngOnInit();

    component.featuresList$.subscribe((featuresList) => {
      expect(featuresList).toEqual(mockFeaturesList);
      expect(component.isImagesFeature).toBe(featuresList.images);
    });
  });
});

@Component({
  selector: 'app-create-contacts-form',
  template: ''
})
class MockCreateContactsFormComponent {
  @Input() provider: Provider;
  @Input() ContactsFormGroup;
}

@Component({
  selector: 'app-create-info-form',
  template: ''
})
class MockCreateInfoComponent {
  @Input() provider: Provider;
  @Input() InfoFormGroup;
  @Input() isImagesFeature: boolean;
}

@Component({
  selector: 'app-create-photo-form',
  template: ''
})
class MockCreatePhotoFormComponent {
  @Input() provider: Provider;
  @Input() isImagesFeature: boolean;
}
