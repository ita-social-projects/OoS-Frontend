import {Component, OnInit} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {GroupDetailService} from "../../../../../shared/services/group-details/group-detail.service";
import {SectionState} from "../../../../../shared/store/section.state";
import {Observable} from "rxjs";
import {GetWorkshopModel} from "../../../../../shared/models/get-workshop.model";
import {GetWorkshopById} from "../../../../../shared/store/section.action";

@Component({
  selector: 'app-about-school',
  templateUrl: './about-school.component.html',
  styleUrls: ['./about-school.component.scss']
})
export class AboutSchoolComponent implements OnInit {
  workshopGroupAbout: GetWorkshopModel;

  constructor(private store: Store, private groupDetailService: GroupDetailService) {
  }

  @Select(SectionState.getWorkShopById) $workshopDetail: Observable<GetWorkshopModel>;

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshopById());
    this.$workshopDetail.subscribe(value => {
      this.workshopGroupAbout = value;
    });
  }

}
