import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category } from 'src/app/shared/models/category.model';
import { AppState } from 'src/app/shared/store/app.state';
import { SetCategories } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { GetCategories } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-category-check-box',
  templateUrl: './category-check-box.component.html',
  styleUrls: ['./category-check-box.component.scss']
})
export class CategoryCheckBoxComponent implements OnInit {
  @Select(MetaDataState.categories)
  categories$: Observable<Category[]>;

  allCategories: Category[] = [];
  selectedCategories: Category[] = [];
  filteredCategories: Category[] = [];
  categorySearch = new FormControl('');
  showAll = true;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetCategories());
    this.categories$.subscribe(categories => this.allCategories = categories);

    this.categorySearch.valueChanges.subscribe((val) => {
      if (val) {
        this.onCategoryFilter(val);
        this.showAll = false;
      } else {
        this.filteredCategories = [];
        this.showAll = true;
      }
    })
  }

  /**
  * This method add checked category to the list of selected categories and distpatch filter action
  * @param category
  * @param event
  */
  onCategoryCheck(category: Category, event: MatCheckbox,): void {
    (event.checked) ? this.selectedCategories.push(category) : this.selectedCategories.splice(this.selectedCategories.indexOf(category), 1);
    this.store.dispatch(new SetCategories(this.selectedCategories));
  }

  /**
  * This method filter categories according to the input value
  * @param value
  */
  onCategoryFilter(value: string): void {
    this.filteredCategories = this.allCategories
      .filter(category => category.title
        .toLowerCase()
        .startsWith(value.toLowerCase())
      )
      .map(category => category);
  }

  /**
  * This method check if value is checked
  * @returns boolean
  */
  onSelectCheck(value: Category): boolean {
    const result = this.selectedCategories
      .some(category => category.title.startsWith(value.title)
      );
    return result;
  }

  onSearch(): void {
    this.showAll = true;
  }
}
