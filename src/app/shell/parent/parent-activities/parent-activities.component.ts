import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ChildActivities } from 'src/app/shared/models/child-activities.model';
import { GetChildrenActivitiesList } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-parent-activities',
  templateUrl: './parent-activities.component.html',
  styleUrls: ['./parent-activities.component.scss']
})
export class ParentActivitiesComponent implements OnInit {

  @Select(UserState.childrenList) childrenList$: Observable<ChildActivities[]>;

  public childrenList: ChildActivities[];

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetChildrenActivitiesList())
    this.childrenList$.subscribe(childrenList => this.childrenList = childrenList);
  }

}
