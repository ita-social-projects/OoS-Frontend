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

  @Select(MetaDataState.selectedCategory)
  selectedCategory$: Observable<Category>;
  @Select(MetaDataState.selectedSubcategory)
  selectedSubcategory$: Observable<Subcategory>;
  @Select(MetaDataState.selectedSubsubcategory)
  selectedSubsubcategory$: Observable<Subsubcategory>;

  @Input() workshop: Workshop;
  @Output() passCategoriesFormGroup = new EventEmitter<FormGroup>();

  CategoryFormGroup: FormGroup;
  selectedCategory: Category;
  selectedSubcategory: Subcategory;
  selectedSubsubcategory: Subsubcategory;

  private ngUnsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private actions$: Actions) {
    this.CategoryFormGroup = this.formBuilder.group({
      category: new FormControl(''),
      subcategory: new FormControl(''),
      subsubcategory: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.passCategoriesFormGroup.emit(this.CategoryFormGroup);
    (this.workshop) && this.activateEditMode();
  }

  onSelectCategory(category: Category): void {
    this.store.dispatch(new GetSubcategories(category.id));
    this.CategoryFormGroup.get('subcategory').setValue('');
    this.CategoryFormGroup.get('subsubcategory').setValue('');
  }

  onSelectSubcategory(subcategory: Subcategory): void {
    this.store.dispatch(new GetSubsubcategories(subcategory.id));
    this.CategoryFormGroup.get('subsubcategory').setValue('');
  }

  activateEditMode(): void {
    this.store.dispatch(new GetCategoryById(this.workshop.categoryId));
    this.store.dispatch(new GetSubcategoryById(this.workshop.subcategoryId));
    this.store.dispatch(new GetSubsubcategoryById(this.workshop.subsubcategoryId));

    this.actions$
    .pipe(
      ofActionSuccessful(OnGetCategoryByIdSuccess),
      takeUntil(this.ngUnsubscribe))
    .subscribe(payload => {this.selectedCategory = payload.payload
      this.CategoryFormGroup.get('category').setValue(payload.payload);
    })

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
