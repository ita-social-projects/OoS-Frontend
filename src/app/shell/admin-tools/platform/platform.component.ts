import { Store } from '@ngxs/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminTabs, AdminTabsUkr, AdminTabsTitle } from '../../../shared/enum/enumUA/tech-admin/admin-tabs';
import { NavBarName } from '../../../shared/enum/navigation-bar';
import { NavigationBarService } from '../../../shared/services/navigation-bar/navigation-bar.service';
import { GetPlatformInfo } from '../../../shared/store/admin.actions';
import { AddNavPath, DeleteNavPath } from '../../../shared/store/navigation.actions';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss'],
})
export class PlatformComponent implements OnInit, OnDestroy {
  readonly adminTabs = AdminTabs;
  readonly adminTabsUkr = AdminTabsUkr;

  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex = 0;
  type: AdminTabs;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private navigationBarService: NavigationBarService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new GetPlatformInfo());
    this.addNavPath();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.tabIndex = params.page && +AdminTabs[params.page];
    });
  }

  private addNavPath(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: NavBarName.Administration,
            path: '/admin-tools/platform',
            queryParams: { page: AdminTabsTitle.AboutPortal },
            isActive: false,
            disable: false,
          },
          {
            name: NavBarName.Portal,
            path: '/admin-tools/platform',
            queryParams: { page: AdminTabsTitle.AboutPortal },
            isActive: false,
            disable: true,
          }
        )
      )
    );
  }

  onSelectedTabChange(event: MatTabChangeEvent): void {
    this.router.navigate([`admin-tools/platform`], { queryParams: { page: AdminTabs[event.index] } });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new DeleteNavPath());
  }
}
