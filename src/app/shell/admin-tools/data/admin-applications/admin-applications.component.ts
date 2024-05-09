import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Store } from '@ngxs/store';

import { PaginationConstants } from 'shared/constants/constants';
import { ApplicationEntityType, ApplicationShowParams } from 'shared/enum/applications';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { ApplicationFilterParameters } from 'shared/models/application.model';
import { PushNavPath } from 'shared/store/navigation.actions';
import { GetAllApplications } from 'shared/store/shared-user.actions';
import { CabinetDataComponent } from '../../../personal-cabinet/shared-cabinet/cabinet-data.component';

@Component({
  selector: 'app-admin-applications',
  templateUrl: './admin-applications.component.html'
})
export class AdminApplicationsComponent extends CabinetDataComponent implements OnInit {
  public applicationParams: ApplicationFilterParameters = {
    property: ApplicationEntityType.provider,
    statuses: [],
    workshops: [],
    children: [],
    show: ApplicationShowParams.All,
    size: PaginationConstants.APPLICATIONS_PER_PAGE,
    from: 0
  };

  constructor(
    protected store: Store,
    protected matDialog: MatDialog
  ) {
    super(store, matDialog);
  }

  public onGetApplications(): void {
    this.store.dispatch(new GetAllApplications(this.applicationParams));
  }

  protected init(): void {
    // No additional initialization
  }

  protected addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Applications,
        isActive: false,
        disable: true
      })
    );
  }
}
