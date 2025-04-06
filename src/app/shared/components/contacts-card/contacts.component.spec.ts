import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngxs/store';
import { MaterialModule } from 'shared/modules/material.module';
import { Address } from 'shared/models/address.model';
import { Workshop } from 'shared/models/workshop.model';
import { Provider } from 'shared/models/provider.model';
import { ContactsCardComponent } from './contacts.component';

describe('ContactsComponent', () => {
  let component: ContactsCardComponent;
  let fixture: ComponentFixture<ContactsCardComponent>;
  let storeMock: any;

  beforeEach(async () => {
    storeMock = {
      selectSnapshot: jest.fn().mockReturnValue([{ phones: ['123'], emails: ['test@example.com'], socialNetworks: [] }])
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule, MaterialModule, TranslateModule.forRoot(), BrowserAnimationsModule],
      declarations: [ContactsCardComponent],
      providers: [{ provide: Store, useValue: storeMock }]
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
      codeficatorAddressDto: { settlement: 'City', fullAddress: 'City, Main St 123' }
    } as Address;
    expect(component.getFullAddress(address)).toBe('City, Main St, 123');
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
      codeficatorAddressDto: { fullAddress: 'City, Main St 123' }
    } as Address;

    it('should use Apple Maps link on iOS devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'iPhone',
        configurable: true
      });
      window.open = jest.fn();

      component.mapLink(address);

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://maps.apple.com/?q=Main%20St%2C%20123%2C%20City%2C%20Main%20St%20123'),
        '_blank'
      );
    });

    it('should use geo URI on Android devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Android',
        configurable: true
      });
      window.open = jest.fn();

      component.mapLink(address);

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('geo:0,0?q=Main%20St%2C%20123%2C%20City%2C%20Main%20St%20123'),
        '_blank'
      );
    });

    it('should use Google Maps link by default', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Windows NT',
        configurable: true
      });
      window.open = jest.fn();

      component.mapLink(address);

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://www.google.com/maps/search/?api=1&query=Main%20St%2C%20123%2C%20City%2C%20Main%20St%20123'),
        '_blank'
      );
    });
  });
});
