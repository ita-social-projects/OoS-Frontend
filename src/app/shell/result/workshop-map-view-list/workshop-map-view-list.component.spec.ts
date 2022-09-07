import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { Workshop, WorkshopFilterCard } from 'src/app/shared/models/workshop.model';
import { WorkshopMapViewListComponent } from './workshop-map-view-list.component';
import { Observable, of } from 'rxjs';

describe('WorkshopMapViewListComponent', () => {
  let component: WorkshopMapViewListComponent;
  let fixture: ComponentFixture<WorkshopMapViewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FlexLayoutModule,
        CommonModule,
        RouterTestingModule,
        MatCardModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [
        WorkshopMapViewListComponent,
        MockMapListWorkshopCardComponent,
        MockResultMapComponent,
        MockMapWorkshopCardPaginatorComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopMapViewListComponent);
    component = fixture.componentInstance;
    component.filteredWorkshops$ = of(null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockMapListWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isCreateFormView: boolean;
  @Input() isHorizontalView: boolean;
}
@Component({
  selector: 'app-map',
  template: ''
})
class MockResultMapComponent {
  @Input() addressFormGroup: FormGroup;
  @Input() workshops: Workshop[];
  @Input() filteredWorkshops$: Observable<WorkshopFilterCard>;
}
@Component({
  selector: 'app-paginator',
  template: ''
})
class MockMapWorkshopCardPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
  @Input() itemsPerPage: number;
}
