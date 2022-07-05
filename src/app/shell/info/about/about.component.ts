import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    public navigationBarService: NavigationBarService,
    private platformService: PlatformService
  ) { }
  platformInformation: CompanyInformation;
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
    this.platformService
      .getPlatformInfo(PlatformInfoType.AboutPortal)
      .toPromise()
      .then(
        (result: CompanyInformation) => (this.platformInformation = result)
      );
  }
  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
