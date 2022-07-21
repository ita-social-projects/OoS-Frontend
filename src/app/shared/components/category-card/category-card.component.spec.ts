import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryCardComponent } from './category-card.component';
import { NgxsModule } from '@ngxs/store';
import { MatCardModule } from '@angular/material/card';
import { Direction } from '../../../shared/models/category.model';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('CategoryCardComponent', () => {
  let component: CategoryCardComponent;
  let fixture: ComponentFixture<CategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatButtonModule,
        NgxsModule.forRoot([]),
        RouterTestingModule,
        MatIconModule
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
