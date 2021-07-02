import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
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
        NgxPaginationModule
      ],
      declarations: [
        WorkshopMapViewListComponent,
        MockMapListWorkshopCardComponent,
        MockResultMapComponent
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
  @Input() address: FormGroup;
  @Input() workshops: Workshop[];
}