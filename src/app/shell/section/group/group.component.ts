import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {SectionState} from '../../../shared/store/section.state';
import {GetWorkshopById} from "../../../shared/store/section.action";


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  constructor(private store: Store) {
  }

  @Select(SectionState.getWorkShopById) $workshopDetail: Observable<object>;

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshopById());
    this.$workshopDetail.subscribe(value => console.log(value));
  }

}
