import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';

import { TranslateCasesPipe } from 'shared/pipes/translate-cases.pipe';
import { SetDirections } from 'shared/store/filter.actions';
import { CategoryCardComponent } from './category-card.component';

describe('CategoryCardComponent', () => {
  let component: CategoryCardComponent;
  let fixture: ComponentFixture<CategoryCardComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatButtonModule, NgxsModule.forRoot([]), RouterTestingModule, MatIconModule],
      declarations: [CategoryCardComponent, TranslateCasesPipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCardComponent);
    component = fixture.componentInstance;
    component.direction = { id: 1, title: 'test', description: 'test' };
    component.isEditMode = true;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit direction delete and select direction after delete button click', () => {
    jest.spyOn(component.deleteDirection, 'emit');
    const deleteButton = fixture.debugElement.query(By.css('[data-testid="del-button"]'));

    deleteButton.nativeElement.click();

    expect(component.deleteDirection.emit).toHaveBeenCalledWith(component.direction);
  });

  it('should select direction', () => {
    jest.spyOn(component, 'selectDirection');
    jest.spyOn(store, 'dispatch');
    const card = fixture.debugElement.query(By.css('mat-card'));

    card.nativeElement.click();

    expect(component.selectDirection).toHaveBeenCalledWith(component.direction);
    expect(store.dispatch).toHaveBeenCalledWith(new SetDirections([component.direction.id]));
  });
});
