import { CommonModule } from '@angular/common';
import { Component, Injectable, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';

import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { Parent } from 'shared/models/parent.model';
import { Workshop } from 'shared/models/workshop.model';
import { Util } from 'shared/utils/utils';
import { ActivatedRoute } from '@angular/router';
import { WorkshopCardsListComponent } from './workshop-cards-list.component';

@Injectable()
class RouteMock {
  snapshot = { queryParams: { chatId: 123 } };
  queryParams = of({ chatId: 123 });
}

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
      imports: [CommonModule, NgxsModule.forRoot([])],
      providers: [{ provide: ActivatedRoute, useClass: RouteMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue(() => of({} as Parent));
    fixture = TestBed.createComponent(WorkshopCardsListComponent);
    component = fixture.componentInstance;
    component.workshops$ = new Observable();
    store = {
      dispatch: jest.fn()
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to top after paginator page change event', () => {
    jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    component.paginationParameters = { from: 1, size: 8 };
    component.onPageChange({ element: 1, isActive: true });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('should change pagination size', () => {
    jest.spyOn(Util, 'setFromPaginationParam');
    component.paginationParameters = { from: 1, size: 8 };
    component.onItemsPerPageChange(12);
    expect(Util.setFromPaginationParam).toHaveBeenCalledWith(
      { from: 0, size: 12 },
      {
        element: 1,
        isActive: true
      },
      undefined
    );
  });
});

@Component({
  selector: 'app-ordering-menu',
  template: ''
})
class MockOrderingComponent {}

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
