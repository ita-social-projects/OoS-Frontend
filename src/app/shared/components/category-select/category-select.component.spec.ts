import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategorySelectComponent } from './category-select.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../mocks/mock-services';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CategorySelectComponent', () => {
  let component: CategorySelectComponent;
  let fixture: ComponentFixture<CategorySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatOptionModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [CategorySelectComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySelectComponent);
    component = fixture.componentInstance;
    component.CategoryFormGroup = new FormGroup({
      categoryId: new FormControl(''),
      subcategoryId: new FormControl(''),
      subsubcategoryId: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
