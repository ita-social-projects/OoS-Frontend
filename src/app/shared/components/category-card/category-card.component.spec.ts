import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { TranslateCasesPipe } from 'shared/pipes/translate-cases.pipe';
import { CategoryCardComponent } from './category-card.component';

describe('CategoryCardComponent', () => {
  let component: CategoryCardComponent;
  let fixture: ComponentFixture<CategoryCardComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit direction delete and select direction', () => {
    const spy = jest.spyOn(component.deleteDirection, 'emit');
    const deleteButton = fixture.debugElement.query(By.css('[data-testid="del-button"]'));

    deleteButton.nativeElement.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should select direction', () => {
    const spy = jest.spyOn(component, 'selectDirection');
    const card = fixture.debugElement.query(By.css('mat-card'));

    card.nativeElement.click();

    expect(spy).toHaveBeenCalled();
  });
});
