import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityFilterComponent } from './city-filter.component';
import { NgxsModule } from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { City } from 'src/app/shared/models/city.model';
import { of } from 'rxjs';
import { FormControl } from '@angular/forms';

describe('CityFilterComponent', () => {
  let component: CityFilterComponent;
  let fixture: ComponentFixture<CityFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      declarations: [
        CityFilterComponent,
        MockCityAutocompleteComponent,
        MockCityConfirmationComponent
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-city-autocomplete',
  template: ''
})
class MockCityAutocompleteComponent {
  @Input() InitialCity: string;
  @Input() className: string;
  @Input() cityFormControl: FormControl;
}

@Component({
  selector: 'app-city-confirmation',
  template: ''
})
class MockCityConfirmationComponent { }
