import {Component, OnInit} from '@angular/core';
import {GetWorkshopModel} from '../../../../../shared/models/get-workshop.model';
import {Select, Store} from '@ngxs/store';
import {SectionState} from '../../../../../shared/store/section.state';
import {Observable} from 'rxjs';
import {GetWorkshopById} from '../../../../../shared/store/section.action';

@Component({
  selector: 'app-about-group',
  templateUrl: './about-group.component.html',
  styleUrls: ['./about-group.component.scss']
})
export class AboutGroupComponent implements OnInit {
  workshopGroupInfo: GetWorkshopModel;

  constructor(private store: Store) {
  }

  @Select(SectionState.getWorkShopById) $workshopDetail: Observable<GetWorkshopModel>;

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshopById());
    this.$workshopDetail.subscribe(value => {
      this.workshopGroupInfo = value;
    });
  }

}
