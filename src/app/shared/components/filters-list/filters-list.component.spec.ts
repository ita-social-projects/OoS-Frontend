import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FiltersListComponent } from './filters-list.component';
import { Store } from '@ngxs/store';
import { MockStore } from '../../mocks/mock-services';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('FiltersListComponent', () => {
  let component: FiltersListComponent;
  let fixture: ComponentFixture<FiltersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        FiltersListComponent,
        MockCityFilterComponent,
        MockCategoryCheckBoxComponent,
        MockPriceFilterComponent,
        MockWorkingHoursComponent,
        MockAgeFilterComponent,
        MockCategoryCheckBoxComponent,
        MockCityFilterComponent
      ],
      providers: [
        { provide: Store, useValue: MockStore }
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-city-filter',
  template: ''
})
class MockCityFilterComponent {}

@Component({
  selector: 'app-category-check-box',
  template: ''
})
class MockCategoryCheckBoxComponent {}

@Component({
  selector: 'app-age-filter',
  template: ''
})
class MockAgeFilterComponent {}

@Component({
  selector: 'app-working-hours',
  template: ''
})
class MockWorkingHoursComponent {}

@Component({
  selector: 'app-price-filter',
  template: ''
})
class MockPriceFilterComponent {}



