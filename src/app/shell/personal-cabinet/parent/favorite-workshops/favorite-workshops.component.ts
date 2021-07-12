import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { GetWorkshopsByParentId } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-favorite-workshops',
  templateUrl: './favorite-workshops.component.html',
  styleUrls: ['./favorite-workshops.component.scss']
})
export class FavoriteWorkshopsComponent implements OnInit {

  @Select(UserState.workshops)
  workshops$: Observable<Workshop[]>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshopsByParentId());
  }

}
