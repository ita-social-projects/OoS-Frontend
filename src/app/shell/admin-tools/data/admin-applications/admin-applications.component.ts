import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetAllApplications } from '../../../../shared/store/shared-user.actions';
import { ApplicationEntityType } from '../../../../shared/enum/applications';
import { ApplicationFilterParameters } from '../../../../shared/models/application.model';

@Component({
  selector: 'app-admin-applications',
  templateUrl: './admin-applications.component.html',
  styleUrls: ['./admin-applications.component.scss']
})
export class AdminApplicationsComponent implements OnInit {
  applicationParams: ApplicationFilterParameters = {
    property: ApplicationEntityType.provider,
    statuses: [],
    workshops: [],
    children: [],
    showBlocked: false
  };

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.onGetApplications();
  }

  onGetApplications(): void {
    this.store.dispatch(new GetAllApplications(this.applicationParams));
  }
}
