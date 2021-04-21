import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {SectionState} from '../../../shared/store/section.state';
import {GetWorkshopById} from '../../../shared/store/section.action';
import {GroupDetailService} from '../../../shared/services/group-details/group-detail.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  workShopDetail: any;

  constructor(private store: Store, private route: ActivatedRoute, private groupDetailService: GroupDetailService) {
  }

  @Select(SectionState.getWorkShopById) $workshopDetail: Observable<object>;

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshopById());
    this.groupDetailService.id = this.route.snapshot.params.id;
    this.$workshopDetail.subscribe(value => {
      this.workShopDetail = value;
    });
  }

}
