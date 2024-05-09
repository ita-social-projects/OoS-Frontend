import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatLegacyAutocompleteModule as MatAutocompleteModule,
  MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent
} from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';

import { Codeficator } from 'shared/models/codeficator.model';
import { GeolocationService } from 'shared/services/geolocation/geolocation.service';
import { FilterChange, SetCoordsByMap } from 'shared/store/filter.actions';
import { GetCodeficatorSearch } from 'shared/store/meta-data.actions';
import { CityFilterComponent } from './city-filter.component';

describe('CityFilterComponent', () => {
  let component: CityFilterComponent;
  let fixture: ComponentFixture<CityFilterComponent>;
  let geolocationService: GeolocationService;
  let store: Store;
  let confirmCitySpy: jest.SpyInstance;
  let storeDispatchSpy: jest.SpyInstance;
  const mockGetCurrentPosition = jest.fn().mockImplementation((success) => {
    success({
      coords: {
        latitude: 50.44029,
        longitude: 30.5595
      }
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatOptionModule,
        MatInputModule,
        MatIconModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [CityFilterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityFilterComponent);
    component = fixture.componentInstance;
    geolocationService = TestBed.inject(GeolocationService);
    store = TestBed.inject(Store);
    (global.navigator as any).geolocation = { getCurrentPosition: mockGetCurrentPosition };
    component.settlementSearchControl = new FormControl('');
    component.settlement = {} as any;
    confirmCitySpy = jest.spyOn(geolocationService, 'confirmCity');
    storeDispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit method', () => {
    let cityInStorageSpy: jest.SpyInstance;
    let localStorageGetItemSpy: jest.SpyInstance;

    beforeEach(() => {
      cityInStorageSpy = jest.spyOn(geolocationService, 'isCityInStorage');
      localStorageGetItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    });

    describe('settlementListener method', () => {
      it('should dispatch GetCodeficatorSearch with correct value when searching value length equals to 3 or more', fakeAsync(() => {
        const mockValue = 'Testing value';
        component.settlementSearchControl.setValue(mockValue);
        const expectedValue = 'Testing value';

        component.settlementSearchControl.valueChanges.subscribe();
        tick(1000);

        expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
        expect(storeDispatchSpy).toHaveBeenCalledWith(new GetCodeficatorSearch(expectedValue));
        expect((component as any).isTopCities).toBeFalsy();
      }));

      it('should dispatch GetCodeficatorSearch with empty string when searching value length fewer than 3 and isTopCities equals false', fakeAsync(() => {
        (component as any).isTopCities = false;
        const mockValue = 'T';
        component.settlementSearchControl.setValue(mockValue);

        component.settlementSearchControl.valueChanges.subscribe();
        tick(1000);

        expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
        expect(storeDispatchSpy).toHaveBeenCalledWith(new GetCodeficatorSearch(''));
        expect((component as any).isTopCities).toBeTruthy();
      }));

      it('should assign to codeficatorSearch value from state when searching value length fewer than 3 and isTopCities equals true', fakeAsync(() => {
        (component as any).isTopCities = true;
        const mockValue = 'Ky';
        component.settlementSearchControl.setValue(mockValue);
        const selectSnapshotSpy = jest.spyOn(store, 'selectSnapshot').mockReturnValue([{ settlement: 'KYIV' }]);

        component.settlementSearchControl.valueChanges.subscribe();
        tick(1000);

        expect(selectSnapshotSpy).toHaveBeenCalledTimes(1);
        expect(component.codeficatorSearch).toEqual([{ settlement: 'KYIV' }]);
      }));
    });

    describe('setCurrentGeolocation method', () => {
      it('should execute confirmCity with correct parameters when CityInStorage exists', () => {
        cityInStorageSpy.mockReturnValueOnce(true);
        localStorageGetItemSpy.mockReturnValueOnce('{ "settlement": "KYIV" }');
        const expectedCityConfirmation = { settlement: 'KYIV' };

        component.ngOnInit();

        expect(confirmCitySpy).toHaveBeenCalledTimes(1);
        expect(confirmCitySpy).toHaveBeenCalledWith(expectedCityConfirmation, true);
      });
    });
  });

  describe('onSelectedCity method', () => {
    let mockEvent: MatAutocompleteSelectedEvent;

    beforeEach(() => {
      mockEvent = {
        option: { value: { settlement: 'Kyiv', latitude: 50.44029, longitude: 35.5595 } } as MatOption
      } as MatAutocompleteSelectedEvent;
    });

    it('should execute confirmCity method with correct settlement data', () => {
      const expectedSettlement = { settlement: 'Kyiv', latitude: 50.44029, longitude: 35.5595 };

      component.onSelectedCity(mockEvent);

      expect(confirmCitySpy).toHaveBeenCalledTimes(1);
      expect(confirmCitySpy).toHaveBeenCalledWith(expectedSettlement, true);
    });

    it('should dispatch SetCoordsByMap with correct coords', () => {
      const expectedCoords = { lat: 50.44029, lng: 35.5595 };

      component.onSelectedCity(mockEvent);

      expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
      expect(storeDispatchSpy).toHaveBeenCalledWith([new SetCoordsByMap(expectedCoords), new FilterChange()]);
    });
  });

  describe('onFocusOut method', () => {
    let mockEvent: FocusEvent;
    let controlSetValueSpy: jest.SpyInstance;

    beforeEach(() => {
      controlSetValueSpy = jest.spyOn(FormControl.prototype, 'setValue');
    });

    it('should set a new value to the settlementSearchControl when event.relatedTarget doesn`t exist', () => {
      mockEvent = { relatedTarget: null } as FocusEvent;
      component.settlement.settlement = 'KYIV';
      const expectedSettlement = 'KYIV';

      component.onFocusOut(mockEvent);

      expect(controlSetValueSpy).toHaveBeenCalledTimes(1);
      expect(controlSetValueSpy).toHaveBeenCalledWith(expectedSettlement);
    });
  });

  describe('confirmCity method', () => {
    it('should execute confirmCity with correct parameters', () => {
      component.settlement = { settlement: 'KYIV' } as Codeficator;
      const expectedSettlement = { settlement: 'KYIV' };

      component.confirmCity();

      expect(confirmCitySpy).toHaveBeenCalledTimes(1);
      expect(confirmCitySpy).toHaveBeenCalledWith(expectedSettlement, true);
    });

    it('should dispatch FilterChange without parameters', () => {
      component.confirmCity();

      expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
      expect(storeDispatchSpy).toHaveBeenCalledWith(new FilterChange());
    });
  });

  describe('changeCity method', () => {
    it('should set false or null to isDisplayed, settlement, settlementSearchControl after changeCity method has been executed', () => {
      component.isDisplayed = true;
      component.settlement = { settlement: 'KYIV' } as Codeficator;
      const controlSetValueSpy = jest.spyOn(FormControl.prototype, 'setValue');

      component.changeCity();

      expect(component.isDisplayed).toBeFalsy();
      expect(controlSetValueSpy).toHaveBeenCalledWith(null);
      expect(component.settlementSearchControl.value).toBeNull();
      expect(component.settlement).toBeNull();
    });

    it('should set focus on searchInput', fakeAsync(() => {
      const focusInputSpy = jest.spyOn((component as any).searchInput.nativeElement, 'focus');

      component.changeCity();
      tick(1000);

      expect(focusInputSpy).toHaveBeenCalledTimes(1);
    }));
  });
});
