import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ChildActivities } from 'src/app/shared/models/child-activities.model';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { ParentState } from 'src/app/shared/store/parent.state';
import { GetActivitiesCards } from 'src/app/shared/store/provider.actions';


@Component({
  selector: 'app-parent-activities',
  templateUrl: './parent-activities.component.html',
  styleUrls: ['./parent-activities.component.scss']
})
export class ParentActivitiesComponent implements OnInit {

  @Select(ParentState.childrenList) childrenList$: Observable<ChildActivities[]>;
  public childrenList: ChildActivities[];

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.store.dispatch(new GetActivitiesCards())
    this.childrenList$.subscribe(childrenList => this.childrenList = childrenList);
  }

}
