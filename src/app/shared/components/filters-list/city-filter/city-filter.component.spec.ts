import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityFilterComponent } from './city-filter.component';
import { Store } from '@ngxs/store';
import { MockStore } from '../../../mocks/mock-services';
import { Component } from '@angular/core';

describe('CityFilterComponent', () => {
  let component: CityFilterComponent;
  let fixture: ComponentFixture<CityFilterComponent>;

  @Component({
    selector: 'app-city-autocomplete',
    template: '<p>Mock City Autocomplete</p>'
  })
  class CityAutocompleteComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityFilterComponent,
        CityAutocompleteComponent],
      providers: [
        { provide: Store, useValue: MockStore }
      ]
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
