import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { Direction } from 'src/app/shared/models/category.model';

import { AllCategoriesComponent } from './all-categories.component';

describe('AllCategoriesComponent', () => {
  let component: AllCategoriesComponent;
  let fixture: ComponentFixture<AllCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      declarations: [
        AllCategoriesComponent,
        MockAllCategoriesSearchbarComponent,
        MockAllCategoriesCardComponent
      ]
    })
      .compileComponents();
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
class MockAllCategoriesSearchbarComponent {
}
@Component({
  selector: 'app-category-card',
  template: ''
})
class MockAllCategoriesCardComponent {
  @Input() direction: Direction;
  @Input() workshopsCount: number;
  @Input() icons: {};
}
