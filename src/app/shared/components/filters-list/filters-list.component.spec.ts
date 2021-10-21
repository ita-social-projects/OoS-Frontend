import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { FiltersListComponent } from './filters-list.component';
import { NgxsModule } from '@ngxs/store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

describe('FiltersListComponent', () => {
  let component: FiltersListComponent;
  let fixture: ComponentFixture<FiltersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        NgxsModule.forRoot([]),
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
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersListComponent);
    component = fixture.componentInstance;
    component.resetFilter$ = of()
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
class MockCategoryCheckBoxComponent {
  @Input() resetFilter$: Observable<void>;
}

@Component({
  selector: 'app-age-filter',
  template: ''
})
class MockAgeFilterComponent {
  @Input() resetFilter$: Observable<void>;
}

@Component({
  selector: 'app-working-hours',
  template: ''
})
class MockWorkingHoursComponent {
  @Input() resetFilter$: Observable<void>;
}

@Component({
  selector: 'app-price-filter',
  template: ''
})
class MockPriceFilterComponent {
  @Input() resetFilter$: Observable<void>;
}



