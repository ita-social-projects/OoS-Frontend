import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxsModule, Store } from '@ngxs/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GeolocationService } from 'shared/services/geolocation/geolocation.service';
import { GetCodeficatorSearch } from 'shared/store/meta-data.actions';
import { CityFilterComponent } from './city-filter.component';

describe('CityFilterComponent', () => {
  let component: CityFilterComponent;
  let fixture: ComponentFixture<CityFilterComponent>;
  let geolocationService: GeolocationService;
  let store: Store;
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
    Object.defineProperty(global.navigator, 'geolocation', {
      value: {
        getCurrentPosition: mockGetCurrentPosition
      }
    });
    component.settlementSearchControl = new FormControl('');
    component.settlement = {} as any;
    geolocationService = TestBed.inject(GeolocationService);
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit method', () => {
    let cityInStorageSpy: jest.SpyInstance;
    let confirmCitySpy: jest.SpyInstance;
    let localStorageGetItemSpy: jest.SpyInstance;
    let storeDispatchSpy: jest.SpyInstance;

    beforeEach(() => {
      cityInStorageSpy = jest.spyOn(geolocationService, 'isCityInStorage');
      confirmCitySpy = jest.spyOn(geolocationService, 'confirmCity');
      localStorageGetItemSpy = jest.spyOn(Storage.prototype, 'getItem');
      storeDispatchSpy = jest.spyOn(store, 'dispatch');
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
        // eslint-disable-next-line @typescript-eslint/dot-notation, dot-notation
        expect(component['isTopCities']).toBeFalsy();
      }));

      it('should dispatch GetCodeficatorSearch with empty string when searching value length fewer than 3 and isTopCities equals false', fakeAsync(() => {
        // eslint-disable-next-line @typescript-eslint/dot-notation, dot-notation
        component['isTopCities'] = false;
        const mockValue = 'T';
        component.settlementSearchControl.setValue(mockValue);

        component.settlementSearchControl.valueChanges.subscribe();
        tick(1000);

        expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
        expect(storeDispatchSpy).toHaveBeenCalledWith(new GetCodeficatorSearch(''));
        // eslint-disable-next-line @typescript-eslint/dot-notation, dot-notation
        expect(component['isTopCities']).toBeTruthy();
      }));

      it('should assign to codeficatorSearch value from state when searching value length fewer than 3 and isTopCities equals true', fakeAsync(() => {
        // eslint-disable-next-line @typescript-eslint/dot-notation, dot-notation
        component['isTopCities'] = true;
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
});
