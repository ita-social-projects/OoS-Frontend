import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ChildActivities } from 'src/app/shared/models/child-activities.model';
import { ChildrenActivitiesListService } from 'src/app/shared/services/children-activities-list/children-activities-list.service';
import { ChangePage } from 'src/app/shared/store/app.actions';


@Component({
  selector: 'app-parent-activities',
  templateUrl: './parent-activities.component.html',
  styleUrls: ['./parent-activities.component.scss']
})
export class ParentActivitiesComponent implements OnInit {

  public childrenList: ChildActivities[];

  constructor(private childrenActivitiesListService: ChildrenActivitiesListService, private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.childrenActivitiesListService.getChildrenList()
      .subscribe((data)=>{
        this.childrenList=data;
    })
  }

}
