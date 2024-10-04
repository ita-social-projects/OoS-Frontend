import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State } from '@ngxs/store';
import { of } from 'rxjs';

import { CodeficatorCategories } from 'shared/enum/codeficator-categories';
import { OwnershipTypes } from 'shared/enum/provider';
import { LicenseStatuses } from 'shared/enum/statuses';
import { FormOfLearning, PayRateType, WorkshopOpenStatus } from 'shared/enum/workshop';
import { FilterStateModel } from 'shared/models/filter-state.model';
import { SharedUserStateModel } from 'shared/store/shared-user.state';
import { MapComponent } from './map.component';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([MockSharedUserState, MockFilterState]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        CommonModule
      ],
      declarations: [MapComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    component.filteredWorkshops$ = of({
      entities: [
        {
          institutionHierarchyId: '',
          institutionId: '',
          institution: '',
          availableSeats: 0,
          takenSeats: 0,
          amountOfPendingApplications: 0,
          status: WorkshopOpenStatus.Open,
          workshopId: '',
          providerTitle: '',
          providerOwnership: OwnershipTypes.State,
          title: '',
          payRate: PayRateType.Classes,
          formOfLearning: FormOfLearning.Offline,
          minAge: 0,
          maxAge: 0,
          competitiveSelection: false,
          price: 0,
          directionIds: [],
          providerId: '',
          address: undefined,
          withDisabilityOptions: false,
          rating: 0,
          numberOfRatings: 0,
          providerLicenseStatus: LicenseStatuses.NotProvided
        }
      ],
      totalAmount: 1
    });
    component.addressFormGroup = new FormGroup({
      street: new FormControl(''),
      buildingNumber: new FormControl(''),
      catottgId: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@State<SharedUserStateModel>({
  name: 'user',
  defaults: {
    isLoading: false,
    workshops: undefined,
    selectedWorkshop: undefined,
    selectedProvider: undefined,
    applicationCards: undefined
  }
})
@Injectable()
class MockSharedUserState {}

@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    directionIds: [],
    maxAge: 0,
    minAge: 0,
    isAppropriateAge: false,
    workingDays: [],
    startTime: '',
    endTime: '',
    formsOfLearning: [],
    isFree: false,
    isPaid: false,
    maxPrice: 0,
    minPrice: 0,
    settlement: {
      id: 0,
      region: '',
      category: CodeficatorCategories.Region,
      territorialCommunity: '',
      settlement: '',
      cityDistrict: '',
      latitude: 0,
      longitude: 0,
      fullName: ''
    },
    searchQuery: '',
    order: '',
    filteredWorkshops: undefined,
    withDisabilityOption: false,
    isStrictWorkdays: false,
    isAppropriateHours: false,
    isLoading: false,
    isConfirmCity: false,
    statuses: [],
    mapViewCoords: undefined,
    userRadiusSize: 0,
    isMapView: false,
    from: 0,
    size: 0
  }
})
@Injectable()
class MockFilterState {}
