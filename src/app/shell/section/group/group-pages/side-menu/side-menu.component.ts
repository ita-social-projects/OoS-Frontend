import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GetWorkshopModel} from "../../../../../shared/models/get-workshop.model";
import {Select, Store} from "@ngxs/store";
import {GroupDetailService} from "../../../../../shared/services/group-details/group-detail.service";
import {SectionState} from "../../../../../shared/store/section.state";
import {Observable} from "rxjs";
import {GetWorkshopById} from "../../../../../shared/store/section.action";

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideMenuComponent implements OnInit {


  workshopSideMenu: GetWorkshopModel;

  constructor(private store: Store, private groupDetailService: GroupDetailService) {
  }

  @Select(SectionState.getWorkShopById) $workshopDetail: Observable<GetWorkshopModel>;

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshopById());
    this.$workshopDetail.subscribe(value => {
      this.workshopSideMenu = value;
    });
  }
}




