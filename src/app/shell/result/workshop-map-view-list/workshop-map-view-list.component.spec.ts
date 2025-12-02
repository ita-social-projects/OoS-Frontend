import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { Observable, of } from 'rxjs';

import { PaginationElement } from 'shared/models/pagination-element.model';
import { Workshop, WorkshopCard } from 'shared/models/workshop.model';
import { WorkshopMapViewListComponent } from './workshop-map-view-list.component';

describe('WorkshopMapViewListComponent', () => {
  let component: WorkshopMapViewListComponent;
  let fixture: ComponentFixture<WorkshopMapViewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, MatCardModule, NgxsModule.forRoot([])],
      declarations: [
        WorkshopMapViewListComponent,
        MockMapListWorkshopCardComponent,
        MockResultMapComponent,
        MockMapWorkshopCardPaginatorComponent
      ]
    }).compileComponents();
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
  @Input() filteredWorkshops$: Observable<WorkshopCard[]>;
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
