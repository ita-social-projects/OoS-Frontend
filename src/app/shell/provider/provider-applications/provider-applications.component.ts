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

  /**
  * This method changes status of emitted event to "approved"
  * @param Application event
  */
  onApprove(event: Application): void {
    const application = this.applications.find((application) => (application === event))
    application.status = 'approved';
  }

  /**
  * This method changes status of emitted event to "denied"
  * @param Application event
  */
  onDeny(event: Application): void {
    const application = this.applications.find((application) => (application === event))
    application.status = 'denied';
  }

  /**
  * This method makes ChildInfoBox visible, pass value to the component and insert it under the position of emitted element
  * @param { element: Element, child: Child } object
  */
  onInfoShow({ element, child }: { element: Element, child: Child }): void {
    this.child = child;
    this.IsVisible = true;
    this.getPosition(element);
  }

  onInfoHide(): void {
    this.IsVisible = false;
  }

  /**
  * This method get position pf emitted element
  * @param Element element
  */
  getPosition(element: Element): void {
    const bodyRect = document.body.getBoundingClientRect();
    const coordinates = element.getBoundingClientRect();
    const offset = coordinates.top - bodyRect.top + 20;
    this.top = offset;
    this.left = coordinates.left;
  }
}
