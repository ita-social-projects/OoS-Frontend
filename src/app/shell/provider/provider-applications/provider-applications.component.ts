import { Component, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ChildInfoBoxComponent } from 'src/app/shared/components/child-info-box/child-info-box.component';
import { Child } from 'src/app/shared/models/child.model';

import { Application } from '../../../shared/models/application.model';
import { GetApplications } from '../../../shared/store/provider.actions';
import { ProviderState } from '../../../shared/store/provider.state';

@Component({
  selector: 'app-provider-requests',
  templateUrl: './provider-applications.component.html',
  styleUrls: ['./provider-applications.component.scss']
})
export class ProviderApplicationsComponent implements OnInit {

  @Select(ProviderState.applicationsList)
  applications$: Observable<Application[]>;
  public applications: Application[];
  child: Child;

  @ViewChild('childInfoBox') childInfoBox: ChildInfoBoxComponent;
  IsVisible: boolean;
  top: number;
  left: number;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetApplications())
    this.applications$.subscribe(applications =>
      this.applications = applications
    );
  }
  onApprove(event: Application): void {
    const application = this.applications.find((application) => (application === event))
    application.status = 'approved';
  }
  onDeny(event: Application): void {
    const application = this.applications.find((application) => (application === event))
    application.status = 'denied';
  }
  onInfoShow({ element, child }: { element: Element, child: Child }): void {
    this.IsVisible = true;
    const bodyRect = document.body.getBoundingClientRect();
    const coordinates = element.getBoundingClientRect();
    const offset = coordinates.top - bodyRect.top + 20;
    this.top = offset;
    this.left = coordinates.left;

    this.child = child;
  }
  onInfoHide(): void {
    this.IsVisible = false;
  }
}
