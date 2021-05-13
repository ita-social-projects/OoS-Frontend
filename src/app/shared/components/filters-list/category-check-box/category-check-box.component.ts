import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategorySelect } from 'src/app/shared/models/category-select.model';
import { CategorySelectService } from 'src/app/shared/services/category-select/category-select.service';

@Component({
  selector: 'app-category-check-box',
  templateUrl: './category-check-box.component.html',
  styleUrls: ['./category-check-box.component.scss']
})
export class CategoryCheckBoxComponent implements OnInit {
  allCategories: CategorySelect[] = [];
  selectedCategories: CategorySelect[] = [];
  filteredCategories: CategorySelect[] = [];
  categorySearch = new FormControl('');
  showAll = true;

  constructor(private categorySelectService: CategorySelectService) { }

  ngOnInit(): void {
    this.categorySelectService.getCategories().subscribe(categories => {
      this.allCategories = categories;
    });

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
  * This method add checked category to the list of selected categories
  */
  onCategoryCheck(event: MouseEvent, category: CategorySelect): void {
    (event) ? this.selectedCategories.push(category) : this.selectedCategories.splice(this.selectedCategories.indexOf(category), 1);
  }
  /**
  * This method filter categories according to the input value
  */
  onCategoryFilter(value): void {
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
  onSelectCheck(value: CategorySelect): boolean {
    const result = this.selectedCategories
      .some(category => category.title.startsWith(value.title)
      );
    return result;
  }

  onSearch(): void {
    this.showAll = true;
  }
}
