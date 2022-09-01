import { Observable } from 'rxjs/internal/Observable';
import { Parent } from 'src/app/shared/models/parent.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopCardsListComponent } from './workshop-cards-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Workshop } from '../../../shared/models/workshop.model';
import { NgxsModule, Store } from '@ngxs/store';
import { NoResultCardComponent } from 'src/app/shared/components/no-result-card/no-result-card.component';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';

describe('WorkshopCardsListComponentt', () => {
  let component: WorkshopCardsListComponent;
  let fixture: ComponentFixture<WorkshopCardsListComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WorkshopCardsListComponent,
        MockOrderingComponent,
        MockListWorkshopCardComponent,
        NoResultCardComponent,
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
    store = TestBed.inject(Store);
    spyOn(store, 'selectSnapshot').and.returnValue({} as Parent);
    fixture = TestBed.createComponent(WorkshopCardsListComponent);
    component = fixture.componentInstance;
    component.workshops$ = new Observable();
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
  @Input() isCreateFormView: boolean;
}
@Component({
  selector: 'app-paginator',
  template: ''
})
class MockListWorkshopCardPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
  @Input() itemsPerPage: number;
}
