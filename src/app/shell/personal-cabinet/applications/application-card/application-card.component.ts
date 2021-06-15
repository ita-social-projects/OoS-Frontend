import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApplicationStatus, ApplicationStatusUkr } from 'src/app/shared/enum/applications';
import { Role } from 'src/app/shared/enum/role';
import { Application } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ApplicationService } from 'src/app/shared/services/applications/application.service';
import { ChildrenService } from 'src/app/shared/services/children/children.service';
import { UserWorkshopService } from 'src/app/shared/services/workshops/user-workshop/user-workshop.service';


@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss']
})

export class ApplicationCardComponent implements OnInit {

  readonly applicationStatusUkr = ApplicationStatusUkr;
  readonly applicationStatus = ApplicationStatus;
  readonly Role = Role;

  constructor(private childrenService: ChildrenService,
    private workshopService: UserWorkshopService) { }

  @Input() application: Application;
  @Input() userRole: string;

  child: Child;
  provider: Provider;
  workshop: Workshop;

  @Output() approved = new EventEmitter();
  @Output() rejected = new EventEmitter();
  @Output() infoShow = new EventEmitter();
  @Output() infoHide = new EventEmitter();

  ngOnInit(): void {
    this.childrenService.getChildrenById(this.application.childId).subscribe(child => this.child = child);
    this.workshopService.getWorkshopsById(this.application.childId).subscribe(workshop => this.workshop = workshop);
  }

  /**
  * This method emit on approve action
  * @param Application application
  */
  onApprove(application: Application): void {
    this.approved.emit(application);
  }

  /**
  * This method emit on deny action
  * @param Application application
  */
  onReject(application: Application): void {
    this.rejected.emit(application);
  }

  /**
  * This method emit on mouseover action on child avatar
  * @param Application application
  */
  onInfoShow(element: Element): void {
    this.infoShow.emit({ element, child: this.child });
  }

  /**
  * This method emit on mouseleave action on child avatar
  * @param Application application
  */
  onInfoHide(element: Element): void {
    this.infoHide.emit();
  }
}