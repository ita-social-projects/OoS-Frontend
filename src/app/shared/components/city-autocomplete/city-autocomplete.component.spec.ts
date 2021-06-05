import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityAutocompleteComponent } from './city-autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Store } from '@ngxs/store';
import { MockCityFilterService, MockStore } from '../../mocks/mock-services';
import { CityFilterService } from '../../services/filters-services/city-filter/city-filter.service';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('CityAutocompleteComponent', () => {
  let component: CityAutocompleteComponent;
  let fixture: ComponentFixture<CityAutocompleteComponent>;
  let cityFilterService: CityFilterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
      ],
      declarations: [ CityAutocompleteComponent ],
      providers: [
        { provide: CityFilterService, useValue: MockCityFilterService },
        { provide: Store, useValue: MockStore }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityAutocompleteComponent);
    component = fixture.componentInstance;
    cityFilterService = TestBed.inject(CityFilterService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



