import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategorySelectComponent } from './category-select.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MockStore } from '../../mocks/mock-services';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

describe('CategorySelectComponentt', () => {
  let component: CategorySelectComponent;
  let fixture: ComponentFixture<CategorySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatOptionModule],
      declarations: [CategorySelectComponent],
      providers: [
        { provide: Store, useValue: MockStore }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySelectComponent);
    component = fixture.componentInstance;
    component.CategoryFormGroup = new FormGroup({
      category: new FormControl(''),
      subcategory: new FormControl(''),
      subsubcategory: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
