import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { cardType } from 'src/app/shared/enum/role';
import { Application } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { User } from 'src/app/shared/models/user.model';
import { Workshop } from 'src/app/shared/models/workshop.model';

import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateApplication, GetChildren } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';


@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss']
})
export class CreateApplicationComponent implements OnInit {

  readonly CardType: typeof cardType = cardType;

  @Select(UserState.children) children$: Observable<Child[]>;
  @Select(RegistrationState.parent) parent$: Observable<Parent>;
  @Select(RegistrationState.user) user$: Observable<User>;


  children: Child[] = [];
  selectedChild: Child;
  // workshop: Workshop;
  workshop = {
    id: 1
  }


  ChildFormControl = new FormControl('');

  constructor(private store: Store, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.store.dispatch(new GetChildren());
  }

  /**
    * This method create new Application
    */
  onSubmit(): void {
    const application = new Application(this.selectedChild.id, this.workshop.id);
    this.store.dispatch(new CreateApplication(application));
  }
}