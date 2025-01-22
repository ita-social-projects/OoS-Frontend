import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { WorkshopOpenStatus } from 'shared/enum/workshop';
import { Direction } from '../../models/category.model';
import { FiltersListComponent } from './filters-list.component';

describe('FiltersListComponent', () => {
  let component: FiltersListComponent;
  let fixture: ComponentFixture<FiltersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        NgxsModule.forRoot([]),
        RouterTestingModule,
        TranslateModule.forRoot()
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
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersListComponent);
    component = fixture.componentInstance;
    const mockFilterList$ = new BehaviorSubject<any>({
      statuses: [WorkshopOpenStatus.Open, WorkshopOpenStatus.Closed],
      withDisabilityOption: false,
      formsOfLearning: ['Offline', 'Online']
    });
    Object.defineProperty(component, 'filterList$', {
      get: () => mockFilterList$.asObservable()
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize filters from state', fakeAsync(() => {
    component.ngOnInit();

    tick();

    expect(component.OpenRecruitmentControl.value).toBe(true);
    expect(component.ClosedRecruitmentControl.value).toBe(true);
    expect(component.WithDisabilityOptionControl.value).toBe(false);
    expect(component.formOfLearningControls.Online.value).toBe(true);
    expect(component.formOfLearningControls.Offline.value).toBe(true);
    expect(component.formOfLearningControls.Mixed.value).toBe(false);
  }));

  it('should append and splice recruitment array', () => {
    component.ngOnInit();
    component.filterList.statuses = [];
    component.statusHandler(true, component.workshopStatus.Open);
    expect(component.filterList.statuses.includes(component.workshopStatus.Open)).toBe(true);
    expect(component.filterList.statuses.length).toBe(1);
    component.statusHandler(true, component.workshopStatus.Closed);
    expect(component.filterList.statuses.includes(component.workshopStatus.Closed)).toBe(true);
    expect(component.filterList.statuses.length).toBe(2);
    component.statusHandler(false, component.workshopStatus.Open);
    expect(component.filterList.statuses.includes(component.workshopStatus.Open)).toBe(false);
    expect(component.filterList.statuses.length).toBe(1);
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
