import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { Institution } from 'shared/models/institution.model';
import { GetAllInstitutions } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';

@Component({
  selector: 'app-directions-wrapper',
  templateUrl: './directions-wrapper.component.html',
  styleUrls: ['./directions-wrapper.component.scss']
})
export class DirectionsWrapperComponent implements OnInit, OnDestroy {
  @Select(MetaDataState.institutions)
  public institutions$: Observable<Institution[]>;

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch([
      new GetAllInstitutions(true),
      new PushNavPath({
        name: NavBarName.Directions,
        isActive: false,
        disable: true
      })
    ]);
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new PopNavPath());
  }
}
