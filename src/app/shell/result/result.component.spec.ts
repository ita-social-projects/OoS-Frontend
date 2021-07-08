import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultComponent } from './result.component';
import { NgxsModule } from '@ngxs/store';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Component, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Workshop } from 'src/app/shared/models/workshop.model';

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
      ],
      declarations: [
        ResultComponent,
        MockSearchbarComponent,
        MockOrderingComponent,
        MockFiltersListComponent,
        MockWorkshopCardsListComponent,
        MockWorkshopMapViewListComponent
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
}

@Component({
  selector: 'app-filters-list',
  template: ''
})
class MockFiltersListComponent {
}
@Component({
  selector: 'app-workshop-cards-list',
  template: ''
})
class MockWorkshopCardsListComponent {
  @Input() workshops: Workshop[];
}
@Component({
  selector: 'app-workshop-map-view-list',
  template: ''
})
class MockWorkshopMapViewListComponent {
  @Input() workshops: Workshop[];
}
