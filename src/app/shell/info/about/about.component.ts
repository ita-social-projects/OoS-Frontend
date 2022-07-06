import {
  AddNavPath,
  DeleteNavPath,
} from 'src/app/shared/store/navigation.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { AdminState } from 'src/app/shared/store/admin.state';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { GetAboutPortal } from 'src/app/shared/store/admin.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, OnDestroy {

  @Select(AdminState.AboutPortal)
  platformInformation$: Observable<CompanyInformation>;

  constructor(
    private store: Store,
    public navigationBarService: NavigationBarService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createOneNavPath({
          name: NavBarName.About,
          isActive: false,
          disable: true,
        })
      )
    );
    this.store
      .dispatch(new GetAboutPortal());
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
