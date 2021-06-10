import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Application } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';

import { Workshop } from 'src/app/shared/models/workshop.model';
import { GetWorkshops } from 'src/app/shared/store/app.actions';
import { GetChildrenById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';


@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss']
})
export class CreateApplicationComponent implements OnInit {

  @Select(UserState.children) children$: Observable<Child[]>;
  children: Child[] = [];
  parent: Parent;
  selectedChildren: Child;
  ApplicationFormGroup: FormGroup;

  constructor(private store: Store, private fb: FormBuilder) {
    this.ApplicationFormGroup = this.fb.group({
      workshopId: new FormControl(''),
      childId: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetChildrenById(null));
    this.children$.subscribe(children => this.children = children);
  }

  /**
    * This method craete new Application
    */
  onSubmit(): void {
    // const info = {
    //   status: 'new',
    //   date: new Date(),
    //   child: this.selectedChildren,
    //   workshop: this.workshop,
    //   message: this.messageCntrl.value
    // }
    // const application = new Application(info);
    console.log(this.ApplicationFormGroup.value)
  }
}