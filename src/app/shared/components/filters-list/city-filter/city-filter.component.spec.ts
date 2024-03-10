import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxsModule } from '@ngxs/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GeolocationService } from 'shared/services/geolocation/geolocation.service';
import { CityFilterComponent } from './city-filter.component';

describe('CityFilterComponent', () => {
  let component: CityFilterComponent;
  let fixture: ComponentFixture<CityFilterComponent>;
  const mockGetCurrentPosition = jest.fn().mockImplementation((success) => {
    success({
      coords: {
        latitude: 50.44029,
        longitude: 30.5595
      }
    });
  });
  let geolocationService: GeolocationService;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit method', () => {
    let cityInStorageSpy: jest.SpyInstance;
    let confirmCitySpy: jest.SpyInstance;
    let localStorageGetItemSpy: jest.SpyInstance;

    beforeEach(() => {
      cityInStorageSpy = jest.spyOn(geolocationService, 'isCityInStorage');
      confirmCitySpy = jest.spyOn(geolocationService, 'confirmCity');
      localStorageGetItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    });

    it('should execute confirmCity with correct parameters when CityInStorage exists', () => {
      cityInStorageSpy.mockReturnValueOnce(true);
      localStorageGetItemSpy.mockReturnValueOnce('{ "settlement": "KYIV" }');
      const expectedCityConfirmation = { settlement: 'KYIV' };

      component.ngOnInit();

      expect(confirmCitySpy).toHaveBeenCalledTimes(1);
      expect(confirmCitySpy).toHaveBeenCalledWith(expectedCityConfirmation, true);
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
