import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CategorySelect } from '../../models/category-select.model';
import { Category } from '../../models/category.model';
import { CategorySelectService } from '../../services/category-select/category-select.service';
import { GetCategories } from '../../store/meta-data.actions';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent implements OnInit {
  @Output() categoriesSelect = new EventEmitter<FormGroup>();
  //lists of options in dropdowns
  data: Category[] = [];
  category: object = {};
  subcategories: string[] = [];
  study: string[] = [];
  selectedCategory = new FormControl(''); //contains current state (which direction was selected)
  selectedSubcategory = new FormControl('');
  selectedStudy = new FormControl('');
  CategoryFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private store: Store) {
    this.CategoryFormGroup = this.formBuilder.group({
      id: new FormControl(''),
      title: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetCategories());

    // this.service.getCategories().subscribe(categories => {
    //   this.data = categories;
    //   this.getCategories(this.data);
    // });

    this.categoriesSelect.emit(this.CategoryFormGroup);
  }

  getCategories(data: CategorySelect[]): void {
    this.category = data.map(el => el.title);
  }

  handleCategorySelect(value: string): void {
    //sets selected option in current "state"
    this.selectedCategory.setValue(value);
    //clears selected faculty and study (all dropdowns should be consistant)
    this.selectedSubcategory.setValue('');
    this.selectedStudy.setValue('');
    //finds faculties, related to selected direction
    const targetCategory = this.data.find(el => el.title === value);
    //creates list of options for 2d dropdown
    const subcategoriesList = targetCategory?.subcategories?.map(el => el.title);
    //sets list of options in this.faculty
    this.subcategories = subcategoriesList;
    //sets output data
    this.CategoryFormGroup.get('title').setValue(value);
    this.CategoryFormGroup.get('id').setValue(targetCategory?.id);
    this.CategoryFormGroup.get('subcategories').setValue([{
      id: null,
      title: null,
      study: [{
        id: null,
        title: null
      }]
    }]);
  }

  handleSubcategorySelect(value: string): void {
    //the same logic as for handleDirectionSelect
    this.selectedSubcategory.setValue(value);
    this.selectedStudy.setValue('');
    const targetCategory = this.data.find(el => el.title === this.selectedCategory.value);
    const targetSubcategory = targetCategory?.subcategories?.find(el => el.title === value);
    const studyList = targetSubcategory?.study;
    this.study = studyList?.map(el => el.title);
    //sets output data
    this.CategoryFormGroup.get('subcategories').setValue([{
      id: targetSubcategory?.id,
      title: value,
      study: [{
        id: null,
        title: null
      }]
    }]);
  }

  handleStudySelect(value: string): void {
    this.selectedStudy.setValue(value);
    const targetCategory = this.data.find(el => el.title === this.selectedCategory.value);
    const targetSubcategory = targetCategory?.subcategories.find(el => el.title === this.selectedSubcategory.value);
    const targetStudy = targetSubcategory?.study.find(el => el.title === value);
    //sets output data
    this.CategoryFormGroup.get('subcategories').setValue([{
      id: targetSubcategory?.id,
      title: targetSubcategory.title,
      study: [
        {
          id: targetStudy?.id,
          title: value,
        }
      ]
    }]);
  }
}
