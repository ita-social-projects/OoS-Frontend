import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category, Subcategory, Subsubcategory } from '../../models/category.model';
import { Workshop } from '../../models/workshop.model';
import { CategoriesService } from '../../services/categories/categories.service';
import { GetCategories, GetSubcategories, GetSubsubcategories } from '../../store/meta-data.actions';
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

  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  subsubcategories: Subsubcategory[] = [];

  @Input() workshop: Workshop;
  @Output() passCategoriesFormGroup = new EventEmitter<FormGroup>();

  CategoryFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private categoriesService: CategoriesService) {
    this.CategoryFormGroup = this.formBuilder.group({
      category: new FormControl(''),
      subcategory: new FormControl(''),
      subsubcategory: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetCategories());
    this.categories$.subscribe(cat => {
      this.categories = cat;
      this.subcategories = [];
      this.subsubcategories = [];
    });
    this.passCategoriesFormGroup.emit(this.CategoryFormGroup);

    (this.workshop) && this.activateEditMode();
  }

  onSelectCategory(category: Category): void {
    this.store.dispatch(new GetSubcategories(category.id));
    this.subcategories$.subscribe(cat => {
      this.subcategories = cat;
      this.subsubcategories = [];
    });
  }

  onSelectSubcategory(subcategory: Subcategory): void {
    this.store.dispatch(new GetSubsubcategories(subcategory.id));
    this.subsubcategories$.subscribe(cat => this.subsubcategories = cat);
  }

  activateEditMode(): void {
    this.categoriesService
      .getCategoryById(this.workshop.categoryId)
      .subscribe(cat => {
        this.CategoryFormGroup.get('category').setValue(cat);
      });

    this.categoriesService
      .getSubCategoryById(this.workshop.subcategoryId)
      .subscribe(cat => {
        this.CategoryFormGroup.get('subcategory').setValue(cat);
        this.subcategories.push(cat);

        this.categoriesService
          .getSubSubCategoryById(this.workshop.subsubcategoryId)
          .subscribe(cat => {
            this.subsubcategories.push(cat);
            this.CategoryFormGroup.get('subsubcategory').setValue(cat);
          });
      });
  }
}
