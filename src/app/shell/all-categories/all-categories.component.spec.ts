import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { Direction } from '../../shared/models/category.model';
import { PaginationElement } from '../../shared/models/paginationElement.model';
import { AllCategoriesComponent } from './all-categories.component';

describe('AllCategoriesComponent', () => {
  let component: AllCategoriesComponent;
  let fixture: ComponentFixture<AllCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]),TranslateModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        AllCategoriesComponent,
        MockAllCategoriesSearchbarComponent,
        MockAllCategoriesCardComponent,
        MockDirectionsPaginatorComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-full-search-bar',
  template: ''
})
class MockAllCategoriesSearchbarComponent {}
@Component({
  selector: 'app-category-card',
  template: ''
})
class MockAllCategoriesCardComponent {
  @Input() direction: Direction;
  @Input() workshopsCount: number;
  @Input() icons: {};
}
@Component({
  selector: 'app-paginator',
  template: ''
})
class MockDirectionsPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
  @Input() itemsPerPage: number;
}
