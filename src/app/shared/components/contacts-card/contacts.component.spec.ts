import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngxs/store';
import { MaterialModule } from 'shared/modules/material.module';
import { Address } from 'shared/models/address.model';
import { Workshop } from 'shared/models/workshop.model';
import { Provider } from 'shared/models/provider.model';
import { WINDOW } from 'ngx-window-token';
import { Platform } from '@angular/cdk/platform';
import { ActivatedRoute } from '@angular/router';
import { ContactsCardComponent } from './contacts.component';

describe('ContactsComponent', () => {
  let component: ContactsCardComponent;
  let fixture: ComponentFixture<ContactsCardComponent>;
  let storeMock: any;
  let windowMock: Window;
  let platformMock: Partial<Platform>;
  let routeMock: any;

  beforeEach(async () => {
    storeMock = {
      selectSnapshot: jest.fn().mockReturnValue([{ phones: ['123'], emails: ['test@example.com'], socialNetworks: [] }])
    };

    windowMock = {
      open: jest.fn(),
      navigator: {
        userAgent: 'Windows NT'
      }
    } as unknown as Window;

    platformMock = {
      IOS: false,
      ANDROID: false
    };
    routeMock = {
      snapshot: {
        paramMap: {
          get: jest.fn()
        },
        routeConfig: {
          path: ''
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule, MaterialModule, TranslateModule.forRoot(), BrowserAnimationsModule],
      declarations: [ContactsCardComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: WINDOW, useValue: windowMock },
        { provide: Platform, useValue: platformMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsCardComponent);
    component = fixture.componentInstance;
    component.workshop = {} as Workshop;
    component.provider = {} as Provider;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getContactsData on init', () => {
    jest.spyOn(component, 'getContactsData');
    component.ngOnInit();
    expect(component.getContactsData).toHaveBeenCalled();
  });

  it('should get full address correctly', () => {
    const address: Address = {
      street: 'Main St',
      buildingNumber: '123',
      codeficatorAddress: { settlement: 'City', fullAddress: 'City, Main St 123' }
    } as Address;
    expect(component.getFullAddress(address)).toBe('City, Main St, 123');
  });

  describe('getContactsData', () => {
    it('should get contacts from provider if route is "info"', () => {
      routeMock.snapshot.routeConfig.path = 'info';
      component.provider = { contacts: [{ name: 'John Doe', phone: '123456789' }] } as unknown as Provider;
      component.getContactsData();
      expect(component.contacts).toEqual([{ name: 'John Doe', phone: '123456789' }]);
    });

    it('should get contacts from store for valid entities', () => {
      const entities = ['workshop', 'competition', 'provider'];
      entities.forEach((entity) => {
        routeMock.snapshot.paramMap.get.mockReturnValue(entity);
        component.getContactsData();
        expect(storeMock.selectSnapshot).toHaveBeenCalledWith(expect.any(Function));
      });
    });

    it('should log warning for unknown entity type', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      routeMock.snapshot.paramMap.get.mockReturnValue('unknownEntity');
      component.getContactsData();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown entity type: unknownEntity');
      consoleWarnSpy.mockRestore();
    });
  });
  describe('mapLink', () => {
    const originalUserAgent = navigator.userAgent;

    afterEach(() => {
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true
      });
    });

    const address: Address = {
      street: 'Main St',
      buildingNumber: '123',
      codeficatorAddress: { fullAddress: 'City, Main St 123' }
    } as Address;

    it('should use Apple Maps link on iOS devices', () => {
      platformMock.IOS = true;
      platformMock.ANDROID = false;
      windowMock.open = jest.fn();
      component.mapLink(address);
      expect(windowMock.open).toHaveBeenCalledWith(
        expect.stringContaining('https://maps.apple.com/?q=Main%20St%2C%20123%2C%20City%2C%20Main%20St%20123'),
        '_blank'
      );
    });

    it('should use geo URI on Android devices', () => {
      platformMock.IOS = false;
      platformMock.ANDROID = true;
      windowMock.open = jest.fn();
      component.mapLink(address);
      expect(windowMock.open).toHaveBeenCalledWith(
        expect.stringContaining('geo:0,0?q=Main%20St%2C%20123%2C%20City%2C%20Main%20St%20123'),
        '_blank'
      );
    });

    it('should use Google Maps link by default', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Windows NT',
        configurable: true
      });
      windowMock.open = jest.fn();
      component.mapLink(address);
      expect(windowMock.open).toHaveBeenCalledWith(
        expect.stringContaining('https://www.google.com/maps/search/?api=1&query=Main%20St%2C%20123%2C%20City%2C%20Main%20St%20123'),
        '_blank'
      );
    });
  });
});
