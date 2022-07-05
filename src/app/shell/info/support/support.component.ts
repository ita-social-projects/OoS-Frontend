import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit, OnDestroy {
  platformSupport: CompanyInformation;
  constructor(private store: Store, public navigationBarService: NavigationBarService, private platformService: PlatformService ) { }

  ngOnInit(): void {
    this.store.dispatch(
      new AddNavPath(this.navigationBarService.createOneNavPath(
        { name: NavBarName.Support, isActive: false, disable: true }
      )),
    );
    this.platformService
    .getPlatformInfo(PlatformInfoType.SupportInformation)
    .toPromise()
    .then(
      (result: CompanyInformation) => (this.platformSupport = result)
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }

}
