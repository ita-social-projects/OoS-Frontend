import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { AdminState } from 'src/app/shared/store/admin.state';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { GetSupportInformation } from 'src/app/shared/store/admin.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit, OnDestroy {
  @Select(AdminState.SupportInformation)
  platformSupport$: Observable<CompanyInformation>;
  @Select(AdminState.isLoading)
  isLoading$: Observable<boolean>;

  constructor(private store: Store, public navigationBarService: NavigationBarService ) { }

  ngOnInit(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createOneNavPath({ name: NavBarName.SupportInformation, isActive: false, disable: true })
      )
    );
    this.store.dispatch(new GetSupportInformation());
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
