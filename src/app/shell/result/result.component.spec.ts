import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultComponent } from './result.component';
import { NgxsModule } from '@ngxs/store';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Component, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { Workshop, WorkshopFilterCard } from 'src/app/shared/models/workshop.model';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { DeclinationPipe } from 'src/app/shared/pipes/declination.pipe';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatButtonToggleModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        MatIconModule,
        RouterTestingModule
      ],
      declarations: [
        ResultComponent,
        MockSearchbarComponent,
        MockOrderingComponent,
        MockFiltersListComponent,
        MockFiltersSidenavComponent,
        MockWorkshopCardsListComponent,
        MockWorkshopMapViewListComponent,
        MockScrollToTopComponent,
        DeclinationPipe,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-full-search-bar',
  template: ''
})
class MockSearchbarComponent {
}

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
  @Input() filteredWorkshops$: Observable<WorkshopFilterCard>;
  @Input() currentPage;;
  @Input() role: string;
}
@Component({
  selector: 'app-scroll-to-top',
  template: ''
})
class MockScrollToTopComponent { }
@Component({
  selector: 'app-sidenav-filters',
  template: ''
})
class MockFiltersSidenavComponent {
  @Input() isMobileView;
  @Input() filtersList;
}
