import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Actions, ofAction, ofActionDispatched, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category, Subcategory, Subsubcategory } from '../../models/category.model';
import { Workshop } from '../../models/workshop.model';
import { CategoriesService } from '../../services/categories/categories.service';
import { GetCategories, GetCategoryById, GetSubcategories, GetSubcategoryById, GetSubsubcategories, GetSubsubcategoryById, OnGetCategoryByIdSuccess, OnGetSubcategoryByIdSuccess, OnGetSubsubcategoryByIdSuccess } from '../../store/meta-data.actions';
import { MetaDataState } from '../../store/meta-data.state';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent implements OnInit {

  @Select(MetaDataState.categories)
  categories$: Observable<Category[]>;
  @Select(MetaDataState.subcategories)
  subcategories$: Observable<Subcategory[]>;
  @Select(MetaDataState.subsubcategories)
  subsubcategories$: Observable<Subsubcategory[]>;

  @Input() workshop: Workshop;
  @Output() passCategoriesFormGroup = new EventEmitter<FormGroup>();

  CategoryFormGroup: FormGroup;

  selectedCategoryId: number;
  selectedSubcategoryId: number;
  selectedSubsubcategoryId: number;

  private ngUnsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store) {
    this.CategoryFormGroup = this.formBuilder.group({
      categoryId: new FormControl(''),
      subcategoryId: new FormControl(''),
      subsubcategoryId: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.passCategoriesFormGroup.emit(this.CategoryFormGroup);
    this.workshop ? this.activateEditMode() : this.store.dispatch(new GetCategories());
  }

  onSelectCategory(id: number): void {
    this.CategoryFormGroup.get('subcategoryId').reset();
    this.CategoryFormGroup.get('subsubcategoryId').reset();
    this.store.dispatch(new GetSubcategories(id));
  }

  onSelectSubcategory(id: number): void {
    this.CategoryFormGroup.get('subsubcategoryId').reset();
    this.store.dispatch(new GetSubsubcategories(id));
  }

  activateEditMode(): void {
    this.store.dispatch(new GetCategories())
      .subscribe(() => this.selectedCategoryId = this.workshop.categoryId);

    this.store.dispatch(new GetSubcategories(this.workshop.categoryId))
      .subscribe(() => this.selectedSubcategoryId = this.workshop.subcategoryId);

    this.store.dispatch(new GetSubsubcategories(this.workshop.subcategoryId))
      .subscribe(() => this.selectedSubsubcategoryId = this.workshop.subsubcategoryId);
  }
}
