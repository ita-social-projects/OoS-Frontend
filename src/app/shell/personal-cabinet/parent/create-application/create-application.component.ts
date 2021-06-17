import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { cardType } from 'src/app/shared/enum/role';
import { Application } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { User } from 'src/app/shared/models/user.model';
import { Workshop } from 'src/app/shared/models/workshop.model';

import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateApplication, GetChildren, GetWorkshopsById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';


@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss']
})
export class CreateApplicationComponent implements OnInit {

  readonly CardType = cardType;

  @Select(UserState.children) children$: Observable<Child[]>;
  @Select(RegistrationState.user) user$: Observable<User>;

  children: Child[] = [];
  selectedChild: Child;

  @Select(UserState.selectedWorkshop) workshop$: Observable<Workshop>;
  workshop: Workshop;

  ChildFormControl = new FormControl('');

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.store.dispatch(new GetChildren());
    const workshopId = +this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new GetWorkshopsById(workshopId));
    this.workshop$.subscribe(workshop => this.workshop = workshop);
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