import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { FormControl } from '@angular/forms';
import { UserState } from '../../store/user.state';
import { Observable } from 'rxjs';
import { Workshop } from '../../models/workshop.model';
import { uniqBy } from 'lodash';

@Component({
  selector: 'app-categories-dropdown',
  templateUrl: './categories-dropdown.component.html',
  styleUrls: ['./categories-dropdown.component.scss']
})
export class CategoriesDropdownComponent implements OnInit {
  @Output() categoriesSelect = new EventEmitter<FormControl>();
  @Select(UserState.workshops)
  $categoriesList: Observable<Workshop[]>;
  public categoriesList: Workshop[];
  selectedCategories = new FormControl([]);

  constructor(private store: Store) { }

  ngOnInit(): void {
    //this.store.dispatch(new GetWorkshops());
    this.$categoriesList.subscribe((data: Workshop[]) => {
      this.categoriesList = data && data.length > 0 ? uniqBy(data, 'id') : [];
      // this.store.dispatch(new SetFilteredWorkshops(this.categoriesList));
    });
    this.categoriesSelect.emit(this.selectedCategories);
  }
}
