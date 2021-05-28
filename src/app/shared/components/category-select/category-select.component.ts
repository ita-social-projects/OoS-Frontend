import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category, Subcategory, Subsubcategory } from '../../models/category.model';
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

  @Output() passCategoriesFormGroup = new EventEmitter<FormGroup>();

  CategoryFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private store: Store) {
    this.CategoryFormGroup = this.formBuilder.group({
      category: new FormControl(''),
      subcategory: new FormControl(''),
      subsubcategory: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetCategories());
    this.passCategoriesFormGroup.emit(this.CategoryFormGroup);
  }

  onSelectCategory(category: Category): void {
    this.store.dispatch(new GetSubcategories(category.id));
  }

  onSelectSubcategory(subcategory: Subcategory): void {
    this.store.dispatch(new GetSubsubcategories(subcategory.id));
  }
}
