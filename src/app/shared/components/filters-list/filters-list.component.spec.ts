import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { FiltersListComponent } from './filters-list.component';
import { NgxsModule } from '@ngxs/store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Direction } from '../../models/category.model';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('FiltersListComponent', () => {
  let component: FiltersListComponent;
  let fixture: ComponentFixture<FiltersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, MatCheckboxModule, FormsModule, ReactiveFormsModule, NgxsModule.forRoot([]), RouterTestingModule, TranslateModule.forRoot(),],
      declarations: [
        FiltersListComponent,
        MockCityFilterComponent,
        MockCategoryCheckBoxComponent,
        MockPriceFilterComponent,
        MockWorkingHoursComponent,
        MockAgeFilterComponent,
        MockCategoryCheckBoxComponent,
        MockCityFilterComponent,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersListComponent);
    component = fixture.componentInstance;
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
class MockCategoryCheckBoxComponent {
  @Input() categoryCheckBox: {};
  @Input() stateDirections: Direction[];
}

@Component({
  selector: 'app-age-filter',
  template: ''
})
class MockAgeFilterComponent {
  @Input() ageFilter: {};
}

@Component({
  selector: 'app-working-hours',
  template: ''
})
class MockWorkingHoursComponent {
  @Input() workingHours: {};
}

@Component({
  selector: 'app-price-filter',
  template: ''
})
class MockPriceFilterComponent {
  @Input() priceFilter: {};
}
