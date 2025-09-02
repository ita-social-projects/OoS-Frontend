import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { Subject } from 'rxjs';

import { CodeficatorCategories } from 'shared/enum/codeficator-categories';
import { ClearCodeficatorSearch, GetCodeficatorSearch } from 'shared/store/meta-data.actions';
import { Address } from 'shared/models/address.model';
import { Codeficator } from 'shared/models/codeficator.model';
import { CreateAddressFormComponent } from './create-address-form.component';

describe('CreateAddressFormComponent', () => {
  let component: CreateAddressFormComponent;
  let fixture: ComponentFixture<CreateAddressFormComponent>;
  let store: Store;
  const codeficatorSub$: Subject<Codeficator[]> = new Subject<Codeficator[]>();
  const codef: Codeficator = {
    id: 111,
    region: 'someregion',
    category: CodeficatorCategories.City,
    territorialCommunity: 'community',
    settlement: 'Київ',
    cityDistrict: 'citydis',
    latitude: 11,
    longitude: 22,
    fullName: 'fn',
    fullAddress: 'fa'
  };

  store = {
    select: jest.fn().mockReturnValue(codeficatorSub$.asObservable()),
    dispatch: jest.fn()
  } as unknown as Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatOptionModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        NgxsModule.forRoot([]),
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [CreateAddressFormComponent, MockValidationHintForInputComponent, MockCityAutocompleteComponent],
      providers: [
        {
          provide: Store,
          useValue: store
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAddressFormComponent);
    component = fixture.componentInstance;
    component.addressFormGroup = new FormGroup({
      street: new FormControl(''),
      buildingNumber: new FormControl(''),
      catottgId: new FormControl('')
    });
    component.searchFormGroup = new FormGroup({
      settlementSearch: new FormControl(''),
      settlement: new FormControl('')
    });
    component.address = {
      street: 'street',
      buildingNumber: 'buildingNumber',
      catottgId: 1,
      latitude: 50,
      longitude: 30,
      codeficatorAddress: {
        category: CodeficatorCategories.City,
        cityDistrict: 'district',
        id: 0,
        region: '',
        territorialCommunity: '',
        settlement: '',
        latitude: 0,
        longitude: 0,
        fullName: ''
      }
    } as Address;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update form controls on selecting a settlement', () => {
    const mockEvent = {
      option: {
        value: { id: '123', settlement: 'Test Settlement', latitude: '10', longitude: '20' }
      }
    } as MatAutocompleteSelectedEvent;

    component.onSelectSettlement(mockEvent);

    expect(component.settlementSearchFormControl.value).toEqual('Test Settlement');
    expect(component.settlementFormControl.value).toEqual(mockEvent.option.value);
    expect(component.codeficatorIdFormControl.value).toEqual('123');
  });

  it('should dispatch clear codeficator search if searching settlement with empty value', fakeAsync(() => {
    jest.spyOn(store, 'dispatch');

    component.settlementSearchFormControl.setValue(null);
    tick(500);

    expect(store.dispatch).toHaveBeenCalledWith(new ClearCodeficatorSearch());
  }));

  it('should get codeficators if search is valid and abandoned', () => {
    component.settlementSearchFormControl.setValue('киї', { emitEvent: false });
    jest.spyOn(store, 'dispatch');
    component.onFocusOut();
    expect(store.dispatch).toHaveBeenCalledWith(new GetCodeficatorSearch('киї'));
    expect((component as any).shouldReplaceQueryWithFirstOption).toBe(true);
  });

  it('should get codeficators if search is invalid and abandoned', () => {
    component.settlementFormControl.setErrors({ some: 'error' });
    jest.spyOn(store, 'dispatch');
    component.onFocusOut();
    expect(store.dispatch).not.toHaveBeenCalledWith();
    expect((component as any).shouldReplaceQueryWithFirstOption).toBe(false);
    expect(component.settlementSearchFormControl.value).toBeFalsy();
  });

  it('should set codeficator with first option if shouldReplaceQueryWithFirstOption is set to true', () => {
    (component as any).shouldReplaceQueryWithFirstOption = true;
    codeficatorSub$.next([codef]);
    expect(component.settlementSearchFormControl.value).toBe('Київ');
    expect(component.settlementFormControl.value).toEqual(codef);
  });

  it('should set codeficator with first option if shouldReplaceQueryWithFirstOption is set to true but no results', () => {
    const initialCodeficator = component.address.codeficatorAddress;
    (component as any).shouldReplaceQueryWithFirstOption = true;
    codeficatorSub$.next([]);
    expect(component.settlementSearchFormControl.value).toEqual(initialCodeficator.settlement);
    expect(component.settlementFormControl.value).toBe(initialCodeficator);
  });
});

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintForInputComponent {
  @Input() validationFormControl: FormControl;
  @Input() minCharacters: number;
  @Input() maxCharacters: number;
  @Input() minMaxDate: boolean;
  @Input() isTouched: boolean;
}

@Component({
  selector: 'app-city-autocomplete',
  template: ''
})
class MockCityAutocompleteComponent {
  @Input() InitialCity: string;
  @Input() className: string;
  @Input() cityFormControl: FormControl;
}
