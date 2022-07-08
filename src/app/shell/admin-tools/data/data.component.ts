import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { Store } from '@ngxs/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { AdminTabs } from 'src/app/shared/enum/enumUA/tech-admin/admin-tabs';

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
          queryParams: { page: AdminTabs[0] },
          isActive: false,
          disable: false,
        })
      )
    );
  }
}
