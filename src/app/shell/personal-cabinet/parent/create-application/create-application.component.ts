import { NavBarName } from './../../../../shared/enum/navigation-bar';
import { NavigationBarService } from './../../../../shared/services/navigation-bar/navigation-bar.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { cardType } from 'src/app/shared/enum/role';
import { Application } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { User } from 'src/app/shared/models/user.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';

import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateApplication, GetChildrenByParentId, GetWorkshopById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { Parent } from 'src/app/shared/models/parent.model';


@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss']
})
export class CreateApplicationComponent implements OnInit, OnDestroy {

  readonly CardType = cardType;

  @Select(UserState.children) children$: Observable<Child[]>;
  @Select(RegistrationState.user) user$: Observable<User>;

  children: Child[] = [];
  selectedChild: Child;

  @Select(UserState.selectedWorkshop) workshop$: Observable<Workshop>;
  workshop: Workshop;

  ChildFormControl = new FormControl('', Validators.required);

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    public navigationBarService: NavigationBarService) { }

  ngOnInit(): void {
    const parent = this.store.selectSnapshot<Parent>(RegistrationState.parent);
    this.store.dispatch(new GetChildrenByParentId(parent.id));

    const workshopId = +this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new GetWorkshopById(workshopId));
    this.workshop$.subscribe(workshop => this.workshop = workshop);

    this.store.dispatch(new AddNavPath(this.navigationBarService.creatOneNavPath(
      { name: NavBarName.TopWorkshops, isActive: false, disable: true })))
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }

  /**
    * This method create new Application
    */
  onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: 'Подати заявку?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const application = new Application(this.selectedChild.id, this.workshop.id);
        this.store.dispatch(new CreateApplication(application));
      }
    });
  }
}