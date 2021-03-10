import { Component, OnInit } from '@angular/core';
import { ChildActivities } from 'src/app/shared/models/child-activities.model';
import { ChildrenActivitiesListService } from 'src/app/shared/services/children-activities-list/children-activities-list.service';


@Component({
  selector: 'app-parent-activities',
  templateUrl: './parent-activities.component.html',
  styleUrls: ['./parent-activities.component.scss']
})
export class ParentActivitiesComponent implements OnInit {

  public childrenList: ChildActivities[];

  constructor(private childrenActivitiesListService: ChildrenActivitiesListService) { }

  ngOnInit(): void {

    this.childrenActivitiesListService.getChildrenList()
      .subscribe((data)=>{
        this.childrenList=data;
    })
  }

}
