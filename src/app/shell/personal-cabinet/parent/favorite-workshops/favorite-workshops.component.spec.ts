import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { PaginationElement } from 'shared/models/pagination-element.model';
import { Workshop } from 'shared/models/workshop.model';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';
import { ParentComponent } from '../parent.component';
import { FavoriteWorkshopsComponent } from './favorite-workshops.component';

describe('FavoriteWorkshopsComponent', () => {
  let component: FavoriteWorkshopsComponent;
  let fixture: ComponentFixture<FavoriteWorkshopsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxsModule.forRoot([]), MatDialogModule],
      declarations: [
        FavoriteWorkshopsComponent,
        MockWorkshopCardComponent,
        MockListWorkshopCardPaginatorComponent,
        NoWorkshopsCardComponent,
        ParentComponent,
        CabinetDataComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue(() => of([] as Workshop[]));
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
  @Input() isCreateFormView: boolean;
}

@Component({
  selector: 'app-paginator',
  template: ''
})
class MockListWorkshopCardPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
  @Input() itemsPerPage: PaginationElement;
}

@Component({
  selector: 'app-no-result-card',
  template: ''
})
class NoWorkshopsCardComponent {
  @Input() title: string;
}
