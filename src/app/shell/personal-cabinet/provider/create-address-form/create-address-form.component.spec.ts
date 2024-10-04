import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, NO_ERRORS_SCHEMA, QueryList } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatOptionModule } from '@angular/material/core';
import {
  MatLegacyAutocompleteModule as MatAutocompleteModule,
  MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent
} from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';

import { CodeficatorCategories } from 'shared/enum/codeficator-categories';
import { ClearCodeficatorSearch } from 'shared/store/meta-data.actions';
import { CreateAddressFormComponent } from './create-address-form.component';

describe('CreateAddressFormComponent', () => {
  let component: CreateAddressFormComponent;
  let fixture: ComponentFixture<CreateAddressFormComponent>;
  let store: Store;

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
      codeficatorAddressDto: {
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
    };
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear form controls on focus out when no value is selected', () => {
    component.autocomplete.options = { first: { value: null } } as QueryList<MatOption>;

    component.onFocusOut();

    expect(component.settlementSearchFormControl.value).toBeNull();
    expect(component.codeficatorIdFormControl.value).toBeNull();
    expect(component.settlementFormControl.value).toBeNull();
  });

  it('should not clear form controls on focus out when no value is selected if autocomplete is open', () => {
    component.settlementSearchFormControl.setValue({ settlement: 'Test Settlement Search' }, { emitEvent: false });
    component.settlementFormControl.setValue({ settlement: 'Test Settlement' }, { emitEvent: false });
    component.autocomplete.options = { first: { value: null } } as any;
    component.autocomplete._isOpen = true;

    component.onFocusOut();

    expect(component.settlementSearchFormControl.value).toEqual(component.settlementFormControl.value.settlement);
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

    expect(store.dispatch).toBeCalledWith(new ClearCodeficatorSearch());
  }));
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
