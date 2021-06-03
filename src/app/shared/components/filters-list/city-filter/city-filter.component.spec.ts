import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { CityFilterComponent } from './city-filter.component';
import { NgxsModule } from '@ngxs/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CityFilterService } from 'src/app/shared/services/filters-services/city-filter/city-filter.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('CityFilterComponent', () => {
  let component: CityFilterComponent;
  let fixture: ComponentFixture<CityFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatAutocompleteModule 
      ],
      declarations: [CityFilterComponent],
      providers: [
        CityFilterService, 
        HttpClient, 
        HttpHandler
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

=======

import { CityFilterComponent } from './city-filter.component';

describe('CityFilterComponent', () => {
  let component: CityFilterComponent;
  let fixture: ComponentFixture<CityFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

>>>>>>> origin/develop
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
