import { Store } from '@ngxs/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationBarService } from '../../../shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath, DeleteNavPath } from '../../../shared/store/navigation.actions';
import { NavBarName } from '../../../shared/enum/navigation-bar';
import { AdminTabTypes } from '../../../shared/enum/admins';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html'
})
export class DataComponent implements OnInit, OnDestroy {
  constructor(private store: Store, private navigationBarService: NavigationBarService) {}

  ngOnInit(): void {
    this.addNavPath();
  }

  private addNavPath(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createOneNavPath({
          name: NavBarName.Administration,
          path: '/admin-tools/platform',
          queryParams: { page: AdminTabTypes.AboutPortal },
          isActive: false,
          disable: false
        })
      )
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
