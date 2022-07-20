import { Workshop } from './../../../../shared/models/workshop.model';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FavoriteWorkshopsComponent } from './favorite-workshops.component';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { ParentComponent } from '../parent.component';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';
import { MatDialog } from '@angular/material/dialog';

describe('FavoriteWorkshopsComponent', () => {
  let component: FavoriteWorkshopsComponent;
  let fixture: ComponentFixture<FavoriteWorkshopsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([])
      ],
      declarations: [
        FavoriteWorkshopsComponent,
        MockWorkshopCardComponent,
        MockListWorkshopCardPaginatorComponent,
        NoWorkshopsCardComponent,
        ParentComponent, 
        CabinetDataComponent,
        MatDialog 
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, 'selectSnapshot').and.returnValue([] as Workshop[]);
    fixture = TestBed.createComponent(FavoriteWorkshopsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isMainPage: boolean;
  @Input() userRoleView: string;
}

@Component({
  selector: 'app-paginator',
  template: ''
})
class MockListWorkshopCardPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
}

@Component({
  selector: 'app-no-result-card',
  template: ''
})
class NoWorkshopsCardComponent {
  @Input() title: string;
}