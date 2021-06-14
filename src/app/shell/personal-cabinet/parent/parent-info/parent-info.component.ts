import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Child } from 'src/app/shared/models/child.model';
import { GetChildren } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';


@Component({
  selector: 'app-parent-info',
  templateUrl: './parent-info.component.html',
  styleUrls: ['./parent-info.component.scss']
})
export class ParentInfoComponent implements OnInit {

  @Select(UserState.children)
  children$: Observable<Child[]>;
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetChildren());
  }

}
