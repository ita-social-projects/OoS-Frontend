import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Child } from 'src/app/shared/models/child.model';
import { GetChildrenById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

const childMock: Child = {
    firstName: "Lena",
    lastName: "VAskiv",
    middleName: "Vaska",
    dateOfBirth: "11.02.1997",
    gender: 0,
    type: true,
    socialGroupId: 0,
    id: null

}
@Component({
  selector: 'app-parent-info',
  templateUrl: './parent-info.component.html',
  styleUrls: ['./parent-info.component.scss']
})
export class ParentInfoComponent implements OnInit {

  @Select(UserState.children)
  children$: Observable<Child[]>;
  children: Child[]
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetChildrenById(null));
    this.children = [childMock]
  }

}
