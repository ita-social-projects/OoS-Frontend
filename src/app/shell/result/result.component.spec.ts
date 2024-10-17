import { CUSTOM_ELEMENTS_SCHEMA, Component, Injectable, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ResultViewType } from 'shared/enum/result-view-type';
import { FilterStateModel } from 'shared/models/filter-state.model';
import { Workshop, WorkshopCard } from 'shared/models/workshop.model';
import { TranslateCasesPipe } from 'shared/pipes/translate-cases.pipe';
import { SetMapView } from 'shared/store/filter.actions';
import { FiltersSidenavToggle } from 'shared/store/navigation.actions';
import { ResultComponent } from './result.component';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([MockFilterState]),
        MatButtonToggleModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        MatIconModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        ResultComponent,
        MockSearchbarComponent,
        MockOrderingComponent,
        MockFiltersListComponent,
        MockWorkshopCardsListComponent,
        MockWorkshopMapViewListComponent,
        MockScrollToTopComponent,
        TranslateCasesPipe
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch SetMapView and set currentViewType when viewHandler method is called', () => {
    jest.spyOn(store, 'dispatch');
    const mockViewType: ResultViewType = ResultViewType.List;

    component.viewHandler(mockViewType);

    expect(component.currentViewType).toEqual(mockViewType);
    expect(store.dispatch).toHaveBeenCalledWith(new SetMapView(component.currentViewType === ResultViewType.Map));
  });

  it('should dispatch FiltersSidenavToggle when filterHandler method is called', () => {
    jest.spyOn(store, 'dispatch');
    const initialSidenavState = component.isFiltersSidenavOpen;

    component.filterHandler();

    expect(store.dispatch).toHaveBeenCalledWith(new FiltersSidenavToggle(!initialSidenavState));
  });

  it('should call calculateMarginLeft on window resize', () => {
    jest.spyOn(component, 'calculateMarginLeft');

    const event = new Event('resize');
    window.dispatchEvent(event);

    expect(component.calculateMarginLeft).toHaveBeenCalled();
  });
});

@Component({
  selector: 'app-full-search-bar',
  template: ''
})
class MockSearchbarComponent {}

@Component({
  selector: 'app-ordering',
  template: ''
})
class MockOrderingComponent {
  @Input() order;
}

@Component({
  selector: 'app-filters-list',
  template: ''
})
class MockFiltersListComponent {
  @Input() filtersList;
}

@Component({
  selector: 'app-workshop-cards-list',
  template: ''
})
class MockWorkshopCardsListComponent {
  @Input() workshops$: Observable<Workshop[]>;
  @Input() currentPage;
  @Input() role: string;
}

@Component({
  selector: 'app-workshop-map-view-list',
  template: ''
})
class MockWorkshopMapViewListComponent {
  @Input() filteredWorkshops$: Observable<WorkshopCard>;
  @Input() currentPage;
  @Input() role: string;
}

@Component({
  selector: 'app-scroll-to-top',
  template: ''
})
class MockScrollToTopComponent {}

@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    directionIds: [],
    maxAge: 0,
    minAge: 0,
    isAppropriateAge: false,
    workingDays: [],
    startTime: '',
    endTime: '',
    formsOfLearning: [],
    isFree: false,
    isPaid: false,
    maxPrice: 0,
    minPrice: 0,
    settlement: undefined,
    searchQuery: '',
    order: '',
    filteredWorkshops: undefined,
    withDisabilityOption: false,
    isStrictWorkdays: false,
    isAppropriateHours: false,
    isLoading: false,
    isConfirmCity: false,
    statuses: [],
    mapViewCoords: undefined,
    userRadiusSize: 0,
    isMapView: false,
    from: 0,
    size: 0
  }
})
@Injectable()
class MockFilterState {}
