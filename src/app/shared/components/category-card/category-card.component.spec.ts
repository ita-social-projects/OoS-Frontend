import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryCardComponent } from './category-card.component';
import { NgxsModule } from '@ngxs/store';
import { MatCardModule } from '@angular/material/card';
import { Direction } from '../../models/category.model';

describe('CategoryCardComponent', () => {
  let component: CategoryCardComponent;
  let fixture: ComponentFixture<CategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [CategoryCardComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCardComponent);
    component = fixture.componentInstance;
    component.direction = {} as Direction;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
