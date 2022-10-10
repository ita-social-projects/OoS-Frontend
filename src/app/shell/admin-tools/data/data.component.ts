import { Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { NavigationBarService } from '../../../shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath, DeleteNavPath } from '../../../shared/store/navigation.actions';
import { NavBarName } from '../../../shared/enum/navigation-bar';
import { AdminTabsTitle } from '../../../shared/enum/enumUA/tech-admin/admin-tabs';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
})
export class DataComponent implements OnInit {
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
          queryParams: { page: AdminTabsTitle.AboutPortal },
          isActive: false,
          disable: false,
        })
      )
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
