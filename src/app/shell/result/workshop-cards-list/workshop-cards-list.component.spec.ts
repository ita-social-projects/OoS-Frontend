import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopCardsListComponent } from './workshop-cards-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { Workshop } from '../../../shared/models/workshop.model';
import { User } from 'src/app/shared/models/user.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { NgxsModule } from '@ngxs/store';

const MockUser = {
  role: '',
};

describe('WorkshopCardsListComponentt', () => {
  let component: WorkshopCardsListComponent;
  let fixture: ComponentFixture<WorkshopCardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WorkshopCardsListComponent,
        MockOrderingComponent,
        MockListWorkshopCardComponent,
        MockListWorkshopCardPaginatorComponent
      ],
      imports: [
        FlexLayoutModule,
        CommonModule,
        NgxsModule.forRoot([]),
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockListWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isMainPage: boolean;
  @Input() userRole: string;
}
class MockListWorkshopCardPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
}
