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
import { Nav } from 'src/app/shared/models/navigation.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { User } from 'src/app/shared/models/user.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';

import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateApplication, GetChildren, GetWorkshopsById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';


@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss']
})
export class CreateApplicationComponent implements OnInit,OnDestroy {

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

  /**
    * This method create new Navigation button
    */
  creatNavPath(name:string, isActive:boolean, disable:boolean): Nav[] {
    return [
      {name:'Головна', path:'/', isActive:true, disable:false},
      {name:name, isActive:isActive, disable:disable}
    ]
  }

  ngOnInit(): void {
    this.store.dispatch(new GetChildren());
    const workshopId = +this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new GetWorkshopsById(workshopId));
    this.workshop$.subscribe(workshop => this.workshop = workshop);
    this.store.dispatch(new AddNavPath(this.creatNavPath("Найпопулярніші гуртки",false,true)))
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