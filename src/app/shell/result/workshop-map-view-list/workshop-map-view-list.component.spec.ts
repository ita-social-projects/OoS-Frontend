import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { Workshop } from 'src/app/shared/models/workshop.model';

import { WorkshopMapViewListComponent } from './workshop-map-view-list.component';

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
  @Input() isMainPage: boolean;
  @Input() userRole: string;
}
@Component({
  selector: 'app-map',
  template: ''
})
class MockResultMapComponent {
  @Input() addressFormGroup: FormGroup;
  @Input() workshops: Workshop[];
}
class MockMapWorkshopCardPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
}