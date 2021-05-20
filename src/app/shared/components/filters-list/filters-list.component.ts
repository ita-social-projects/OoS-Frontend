import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { SetClosedRecruitment, SetOpenRecruitment } from '../../store/filter.actions';
@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss']
})
export class FiltersListComponent implements OnInit {

  OpenRecruitmentControl = new FormControl(false);
  ClosedRecruitmentControl = new FormControl(false);

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.OpenRecruitmentControl.valueChanges.subscribe(val => this.store.dispatch(new SetOpenRecruitment(val)));
    this.ClosedRecruitmentControl.valueChanges.subscribe(val => this.store.dispatch(new SetClosedRecruitment(val)));
  }


}
