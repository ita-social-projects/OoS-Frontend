import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { PopNavPath, PushNavPath } from '../../../../shared/store/navigation.actions';
import { MetaDataState } from '../../../../shared/store/meta-data.state';
import { Institution } from '../../../../shared/models/institution.model';
import { GetAllInstitutions } from '../../../../shared/store/meta-data.actions';

@Component({
  selector: 'app-directions-wrapper',
  templateUrl: './directions-wrapper.component.html',
  styleUrls: ['./directions-wrapper.component.scss']
})
export class DirectionsWrapperComponent implements OnInit, OnDestroy {
  @Select(MetaDataState.institutions)
  institutions$: Observable<Institution[]>;
  
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch([new GetAllInstitutions(),
      new PushNavPath({
        name: NavBarName.Directions,
        isActive: false,
        disable: true
      })
    ]);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new PopNavPath());
  }
}
