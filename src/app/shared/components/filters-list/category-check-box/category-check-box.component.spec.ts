import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryCheckBoxComponent } from './category-check-box.component';

describe('CategoryCheckBoxComponent', () => {
  let component: CategoryCheckBoxComponent;
  let fixture: ComponentFixture<CategoryCheckBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatFormFieldModule,
        NgxsModule.forRoot([]),
        ReactiveFormsModule,
        MatInputModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [CategoryCheckBoxComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
