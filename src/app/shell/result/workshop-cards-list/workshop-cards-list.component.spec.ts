import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopCardsListComponent } from './workshop-cards-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxsModule, Store } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { MockStore } from '../../../shared/mocks/mock-services';
import { Component } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

describe('WorkshopCardsListComponentt', () => {
  let component: WorkshopCardsListComponent;
  let fixture: ComponentFixture<WorkshopCardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WorkshopCardsListComponent,
        MockOrderingComponent
      ],
      imports: [
        FlexLayoutModule,
        CommonModule,
        NgxsModule.forRoot([]),
        NgxPaginationModule
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCardsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-ordering-menu',
  template: ''
})
class MockOrderingComponent {
}

