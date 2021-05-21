import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Application } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';

import { Workshop } from 'src/app/shared/models/workshop.model';
import { GetWorkshops } from 'src/app/shared/store/app.actions';
import { AppState } from 'src/app/shared/store/app.state';
import { GetChildrenById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';


@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss']
})
export class CreateApplicationComponent implements OnInit {

  workshop: Workshop;
  isChildInfo: boolean = true;
  @Select(AppState.allWorkshops) workshops$: Observable<Workshop[]>;
  @Select(UserState.children) children$: Observable<Child[]>;
  children: Child[] = [];
  parent: Parent;
  selectedChildren: Child;
  messageCntrl = new FormControl('');

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshops());
    this.store.dispatch(new GetChildrenById(null));
    this.workshops$.subscribe((workshops: Workshop[]) => this.workshop = workshops[0])
    this.children$.subscribe(children => this.children = children);
  }

  ShowChildInfo(): void {
    this.isChildInfo = true;
  }

  ShowParentInfo(): void {
    this.isChildInfo = false;
  }
  /**
    * This method craete new Application
    */
  onSubmit(): void {
    const info = {
      status: 'new',
      date: new Date(),
      child: this.selectedChildren,
      workshop: this.workshop,
      message: this.messageCntrl.value
    }
    const application = new Application(info);
  }
}